import { ChatMessageDto } from '../../types/chat.dto';

export interface IChatService {
  getRecentMessages(limit?: number): Promise<ChatMessageDto[]>;
  sendMessage(userId: string, content: string): Promise<ChatMessageDto>;
}
