import { Document } from 'mongoose';
import { User, IUser } from '../models/user.model';
import { BaseRepository } from './base.repository';
import { IUserRepository } from './interfaces/user-repository.interface';

export class UserRepository extends BaseRepository<IUser> implements IUserRepository {

  constructor() {
    super(User)
  }
  async findByUsername(username: string): Promise<IUser | null> {
    return await this.model.findOne({ username: username.toLowerCase() });
  }

  async updateLastSeen(id: string): Promise<IUser | null> {
    return await this.model.findByIdAndUpdate(
      id,
      { lastSeenAt: new Date() },
      { new: true }
    );
  }
}
