import 'dotenv/config';
import { env } from './utils/env-config';
import app from './app';
import { connectDB } from './configs/db';
import { PollRepository } from './repositories/poll.repository';
import { VoteRepository } from './repositories/vote.repository';
import { PollService } from './services/poll.service';

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

    const pollRepo = new PollRepository();
    const voteRepo = new VoteRepository();
    const pollService = new PollService(pollRepo, voteRepo);
    await pollService.seedPredefinedPolls();

    const server = app.listen(env.PORT, () => {
      console.log(
        `Server running in ${env.NODE_ENV} mode on port ${env.PORT}`
      );
    });

    // Graceful shutdown for rejected promises
    process.on('unhandledRejection', (err: Error) => {
      console.error('UNHANDLED REJECTION! Shutting down...');
      console.error(err.name, err.message);

      server.close(() => {
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