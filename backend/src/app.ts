import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { env } from './utils/env-config';
import { sendSuccess } from './utils/response';
import { HttpStatusCode } from 'axios';
import userRoutes from './routes/user.routes';
import { sessionMiddleware } from './configs/session';
import { ROUTES } from './utils/routes';

const app: Application = express();

app.use(
  cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(env.NODE_ENV === 'development' ? 'dev' : 'combined'));

//Session configuration
app.use(sessionMiddleware);

//Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  sendSuccess(res, HttpStatusCode.Accepted, 'QuickPoll API is healthy and running', {
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

//API Routes
app.use(ROUTES.USER.BASE, userRoutes);
// app.use('/api/polls', pollRoutes);

// app.all('*', (req: Request, _res: Response, next: NextFunction) => {
//   next(new AppError(`Route ${req.method} ${req.originalUrl} not found`, 404));
// });

// //Global error handler middleware
// app.use(globalErrorHandler);

export default app;