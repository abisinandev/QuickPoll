import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/app-error';

/**
 * Middleware for checking authentication.
 * Extract req.session.userId.
 */
export const requireAuth = (req: Request, _res: Response, next: NextFunction): void => {
  if (!req.session || !req.session.userId) {
    return next(new AppError('Unauthorized. Please join QuickPoll first.', 401));
  }
  next();
};
