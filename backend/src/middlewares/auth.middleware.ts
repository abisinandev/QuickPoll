import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/app-error';

/**
 * Middleware to enforce authenticated session for protected endpoints.
 * Extracts user ID strictly from server session (req.session.userId).
 */
export const requireAuth = (req: Request, _res: Response, next: NextFunction): void => {
  if (!req.session || !req.session.userId) {
    return next(new AppError('Unauthorized. Please join QuickPoll first.', 401));
  }
  next();
};
