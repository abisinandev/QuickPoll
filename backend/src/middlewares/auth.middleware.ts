import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/app-error';
import { MESSAGES } from '../utils/messages';
import { HTTP_STATUS } from '../utils/http-status';

/**
 * Middleware for checking authentication.
 * Extract req.session.userId.
 */
export const requireAuth = (req: Request, _res: Response, next: NextFunction): void => {
  if (!req.session || !req.session.userId) {
    return next(new AppError(MESSAGES.USER.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED));
  }
  next();
};
