import { Request, Response, NextFunction } from 'express';
import { sendSuccess } from '../utils/response';
import { HttpStatusCode } from 'axios';
import { IPollService } from '../services/interfaces/poll-service.interface';

export class PollController {

  constructor(private readonly _pollService: IPollService) {}


  getPolls = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.session?.userId;
      const polls = await this._pollService.getActivePolls(userId);
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

      const updatedPoll = await this._pollService.vote(userId, pollId, optionId);

      sendSuccess(res, HttpStatusCode.Ok, 'Vote recorded successfully', { poll: updatedPoll });
    } catch (error) {
      next(error);
    }
  };
}
