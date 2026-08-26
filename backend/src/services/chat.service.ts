import { IChatRepository } from '../repositories/interfaces/chat-repository.interface';
import { IChatService } from './interfaces/chat-service.interface';
import { ChatMessageDto } from '../types/chat.dto';
import { AppError } from '../utils/app-error';
import { MESSAGES } from '../utils/messages';
import { HTTP_STATUS } from '../utils/http-status';

export class ChatService implements IChatService {
  constructor(private readonly chatRepository: IChatRepository) {}

  private mapToDto(message: any): ChatMessageDto {
    return {
      id: message._id.toString(),
      user: {
        id: message.userId._id ? message.userId._id.toString() : message.userId.toString(),
        username: message.userId.username || 'Unknown',
      },
      content: message.message,
      createdAt: message.createdAt.toISOString(),
    };
  }

  async getRecentMessages(limit: number = 50): Promise<ChatMessageDto[]> {
    const messages = await this.chatRepository.getRecentMessages(limit);
    return messages.reverse().map((msg) => this.mapToDto(msg));
  }

  async sendMessage(userId: string, content: string): Promise<ChatMessageDto> {
    if (!content || !content.trim()) {
      throw new AppError(MESSAGES.CHAT.MESSAGE_EMPTY, HTTP_STATUS.BAD_REQUEST);
    }

    const trimmedContent = content.trim();
    if (trimmedContent.length > 200) {
      throw new AppError(MESSAGES.CHAT.MESSAGE_TOO_LONG, HTTP_STATUS.BAD_REQUEST);
    }

    const message = await this.chatRepository.createMessage(userId, trimmedContent);
    return this.mapToDto(message);
  }
}
