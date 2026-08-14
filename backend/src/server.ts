import 'dotenv/config';
import { env } from './utils/env-config';
import app from './app';
import { connectDB } from './configs/db';
import { PollRepository } from './repositories/poll.repository';
import { VoteRepository } from './repositories/vote.repository';
import { PollService } from './services/poll.service';
import { createServer } from 'http';
import { SocketService } from './services/socket.server';
import { buildContainer } from './utils/containers';
import { createPollRouter } from './routes/poll.routes';
import { AppError } from './utils/app-error';
import { NextFunction, Response, Request } from 'express';
import { globalErrorHandler } from './middlewares/error.middleware';

process.on('uncaughtException', (err: Error) => {
  console.error('UNCAUGHT EXCEPTION! Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

process.on('unhandledRejection', (err: Error) => {
  console.error('UNHANDLED REJECTION! Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received. Gracefully shutting down...');
  process.exit(0);
});

const startServer = async () => {
  try {
    await connectDB();

    const httpServer = createServer(app);

    const container = buildContainer(httpServer);

    const pollRouter = createPollRouter(
      container.pollController
    );

    app.use('/api/polls', pollRouter);

    app.all('*', (req: Request, _res: Response, next: NextFunction) => {
      next(new AppError(`Route ${req.method} ${req.originalUrl} not found`, 404));
    });

    //Global error handler middleware
    app.use(globalErrorHandler);

    httpServer.listen(env.PORT, () => {
      console.log(
        `Server running in ${env.NODE_ENV} mode on port ${env.PORT}`
      );
    });

    // Graceful shutdown for rejected promises
    process.on('unhandledRejection', (err: Error) => {
      console.error('UNHANDLED REJECTION! Shutting down...');
      console.error(err.name, err.message);

      httpServer.close(() => {
        process.exit(1);
      });
    });

  } catch (error) {
    console.error('❌ Database connection failed.');

    if (error instanceof Error) {
      console.error(error.name, error.message);
    } else {
      console.error(error);
    }

    process.exit(1);
  }
};

startServer();