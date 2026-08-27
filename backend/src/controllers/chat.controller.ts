import { Request, Response, NextFunction } from 'express';
import { IChatService } from '../services/interfaces/chat-service.interface';
import { sendSuccess } from '../utils/response';
import { HTTP_STATUS } from '../utils/http-status';
import { MESSAGES } from '../utils/messages';
import { ChatMessageDto } from '../types/chat.dto';

export class ChatController {
  constructor(private readonly chatService: IChatService) {}

  async getRecentMessages(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const limitParam = req.query.limit ? parseInt(req.query.limit as string, 10) : 50;
      const limit = isNaN(limitParam) ? 50 : Math.min(Math.max(limitParam, 1), 100);

      const messages: ChatMessageDto[] = await this.chatService.getRecentMessages(limit);

      sendSuccess(res, HTTP_STATUS.OK, MESSAGES.CHAT.HISTORY_FETCHED, { messages });
    } catch (error) {
      next(error);
    }
  }
}
