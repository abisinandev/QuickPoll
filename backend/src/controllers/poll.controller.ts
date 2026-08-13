import { Request, Response, NextFunction } from 'express';
import { PollService } from '../services/poll.service';
import { sendSuccess } from '../utils/response';
import { HttpStatusCode } from 'axios';

export class PollController {
  constructor(private readonly _pollSvc: PollService) {}

  getPolls = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.session?.userId;
      const polls = await this._pollSvc.getActivePolls(userId);
      sendSuccess(res, HttpStatusCode.Ok, 'Polls retrieved successfully', { polls });
    } catch (error) {
      next(error);
    }
  };

  vote = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.session.userId!;
      const { pollId } = req.params;
      const { optionId } = req.body;

      const updatedPoll = await this._pollSvc.vote(userId, pollId, optionId);

      sendSuccess(res, HttpStatusCode.Ok, 'Vote recorded successfully', { poll: updatedPoll });
    } catch (error) {
      next(error);
    }
  };
}
