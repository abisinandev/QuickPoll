import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';
import { sendSuccess } from '../utils/response';
import { HTTP_STATUS } from '../utils/http-status';
import { MESSAGES } from '../utils/messages';

export class UserController {
  constructor(private readonly _userSvc: UserService) { }

  joinGuest = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { username } = req.body;
      const user = await this._userSvc.joinGuest(username);

      req.session.userId = (user._id as string | object).toString();

      req.session.save((err) => {
        if (err) {
          return next(err);
        }
        sendSuccess(res, HTTP_STATUS.CREATED, MESSAGES.USER.JOINED, {
          user: {
            id: user._id,
            username: user.username,
          },
        });
      });
    } catch (error) {
      next(error);
    }
  };

  getMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.session.userId;
      if (!userId) {
        sendSuccess(res, HTTP_STATUS.UNAUTHORIZED, MESSAGES.USER.UNAUTHENTICATED, { user: null });
        return;
      }

      const user = await this._userSvc.getCurrentUser(userId);

      if (!user) {
        req.session.destroy(() => { });
        sendSuccess(res, HTTP_STATUS.UNAUTHORIZED, MESSAGES.USER.UNAUTHENTICATED, { user: null });
        return;
      }

      sendSuccess(res, HTTP_STATUS.OK, MESSAGES.USER.SESSION_FETCHED, {
        user: {
          id: user._id,
          username: user.username,
        },
      });
    } catch (error) {
      next(error);
    }
  };
}
