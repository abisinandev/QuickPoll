import { Response } from 'express';

interface SuccessResponse<T> {
  success: true;
  statusCode: number;
  message: string;
  data: T;
  meta?: ResponseMeta;
}

interface ErrorResponseBody {
  success: false;
  statusCode: number;
  message: string;
  errors?: unknown;
}

export interface ResponseMeta {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
  [key: string]: unknown;
}

/**
 * Send a standardized success response.
 *
 * @param res       - Express Response object
 * @param statusCode - HTTP status code (e.g. 200, 201)
 * @param message   - Human-readable success message
 * @param data      - Payload to return to the client
 * @param meta      - Optional pagination or extra metadata
 *
 * @example
 * sendSuccess(res, 200, 'Users fetched successfully', users, { total: 100 });
 */
export const sendSuccess = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data: T,
  meta?: ResponseMeta,
): void => {
  const body: SuccessResponse<T> = {
    success: true,
    statusCode,
    message,
    data,
    ...(meta && { meta }),
  };

  res.status(statusCode).json(body);
};

/**
 * Send a standardized error response.
 * Prefer throwing `AppError` in most cases; use this only when you need
 * to send an error response directly without going through the error handler.
 *
 * @param res       - Express Response object
 * @param statusCode - HTTP status code (e.g. 400, 404, 500)
 * @param message   - Human-readable error message
 * @param errors    - Optional validation errors or additional context
 *
 * @example
 * sendError(res, 400, 'Validation failed', { field: 'email', issue: 'Invalid format' });
 */
export const sendError = (
  res: Response,
  statusCode: number,
  message: string,
  errors?: unknown,
): void => {
  const body: ErrorResponseBody = {
    success: false,
    statusCode,
    message,
    ...(errors !== undefined && { errors }),
  };

  res.status(statusCode).json(body);
};
