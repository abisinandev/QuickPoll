import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { env } from './utils/env-config';
import { sendSuccess } from './utils/response';
import { HttpStatusCode } from 'axios';
import { sessionMiddleware } from './configs/session';

const app: Application = express();

app.use(
  cors({
    origin: env.FRONTEND_URL,
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

export default app;