import { Message, IMessage } from '../models/message.model';
import { BaseRepository } from './base.repository';
import { IChatRepository } from './interfaces/chat-repository.interface';

export class ChatRepository extends BaseRepository<IMessage> implements IChatRepository {
  constructor() {
    super(Message);
  }

  async getRecentMessages(limit: number): Promise<IMessage[]> {
    return await this.model
      .find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('userId', 'username')
      .exec();
  }

  async createMessage(userId: string, message: string): Promise<IMessage> {
    const newMessage = new this.model({
      userId,
      message,
    });
    await newMessage.save();
    return newMessage.populate('userId', 'username');
  }
}
