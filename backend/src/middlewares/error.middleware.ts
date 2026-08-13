import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/app-error';
import { env } from '../utils/env-config';
import { HttpStatusCode } from 'axios';

interface ErrorResponse {
  status: string;
  message: string;
  stack?: string;
}

/**
 * Sends a structured error response for known operational errors.
 */
const sendOperationalError = (err: AppError, res: Response): void => {
  const body: ErrorResponse = {
    status: err.status,
    message: err.message,
  };

  if (env.NODE_ENV === 'development') {
    body.stack = err.stack;
  }

  res.status(err.statusCode).json(body);
};

/**
 * Sends a generic 500 response for unexpected programming errors.
 */
const sendProgrammingError = (err: Error, res: Response): void => {
  console.error('UNEXPECTED ERROR:', err);

  const body: ErrorResponse =
    env.NODE_ENV === 'development'
      ? { status: 'error', message: err.message, stack: err.stack }
      : { status: 'error', message: 'Something went very wrong!' };

  res.status(HttpStatusCode.InternalServerError).json(body);
};

/**
 * Global Express error-handling middleware.
 */
export const globalErrorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (err instanceof AppError) {
    sendOperationalError(err, res);
  } else {
    sendProgrammingError(err, res);
  }
};
