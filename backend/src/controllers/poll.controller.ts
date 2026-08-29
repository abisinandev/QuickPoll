import { Request, Response, NextFunction } from 'express';
import { sendSuccess } from '../utils/response';
import { HTTP_STATUS } from '../utils/http-status';
import { MESSAGES } from '../utils/messages';
import { IPollService } from '../services/interfaces/poll-service.interface';

export class PollController {

  constructor(private readonly _pollService: IPollService) {}

  getPolls = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.session?.userId;
      const polls = await this._pollService.getActivePolls(userId);
      sendSuccess(res, HTTP_STATUS.OK, MESSAGES.POLL.FETCHED, { polls });
    } catch (error) {
      next(error);
    }
  };

  vote = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.session.userId!;
      const { pollId } = req.params;
      const { optionId } = req.body;

      const { poll, action } = await this._pollService.vote(userId, pollId, optionId);

      const message =
        action === 'removed'
          ? MESSAGES.POLL.VOTE_REMOVED
          : action === 'changed'
            ? MESSAGES.POLL.VOTE_UPDATED
            : MESSAGES.POLL.VOTE_RECORDED;

      sendSuccess(res, HTTP_STATUS.OK, message, { poll });
    } catch (error) {
      next(error);
    }
  };
}
