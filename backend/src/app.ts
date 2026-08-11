import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { env } from './utils/envConfig.js';
import { AppError } from './utils/app-error.js';
import { globalErrorHandler } from './middlewares/error.middleware.js';
import { sendSuccess } from './utils/response.js';
import { HttpStatusCode } from 'axios';

const app: Application = express();

//Cors origin
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan(env.NODE_ENV === "development" ? "dev" : "combined"));

app.get('/api/v1/health', (_req: Request, res: Response) => {
  sendSuccess(res, HttpStatusCode.Accepted, 'QuickPoll API is healthy and running', {
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});


app.all('*', (req: Request, _res: Response, next: NextFunction) => {
  next(new AppError(`Route ${req.method} ${req.originalUrl} not found`, 404));
});

//Global error hanlder
app.use(globalErrorHandler);

export default app;
