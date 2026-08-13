import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { env } from './utils/env-config';
import { AppError } from './utils/app-error';
import { globalErrorHandler } from './middlewares/error.middleware';
import { sendSuccess } from './utils/response';
import { HttpStatusCode } from 'axios';
import userRoutes from './routes/user.routes';
import pollRoutes from './routes/poll.routes';

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

// express-session configuration
app.use(
  session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: env.MONGO_URL,
      collectionName: 'sessions',
      ttl: 24 * 60 * 60, // 1 day in seconds
    }),
    cookie: {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
    },
  })
);

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  sendSuccess(res, HttpStatusCode.Accepted, 'QuickPoll API is healthy and running', {
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/polls', pollRoutes);

app.all('*', (req: Request, _res: Response, next: NextFunction) => {
  next(new AppError(`Route ${req.method} ${req.originalUrl} not found`, 404));
});

// Global error handler middleware
app.use(globalErrorHandler);

export default app;