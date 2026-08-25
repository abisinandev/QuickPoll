import { IMessage } from '../../models/message.model';
import { IBaseRepository } from './base-repository.interface';

export interface IChatRepository extends IBaseRepository<IMessage> {
  getRecentMessages(limit: number): Promise<IMessage[]>;
  createMessage(userId: string, message: string): Promise<IMessage>;
}
