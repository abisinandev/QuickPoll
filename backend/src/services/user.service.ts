import { UserRepository } from '../repositories/user.repository';
import { IUser } from '../models/user.model';
import { AppError } from '../utils/app-error';
import { MESSAGES } from '../utils/messages';
import { HTTP_STATUS } from '../utils/http-status';

export class UserService {
  constructor(private userRepo: UserRepository) { }

  async joinGuest(username: string): Promise<IUser> {
    if (!username || typeof username !== 'string') {
      throw new AppError(MESSAGES.USER.USERNAME_REQUIRED, HTTP_STATUS.BAD_REQUEST);
    }

    username = username.trim();

    if (username.length === 0) {
      throw new AppError(MESSAGES.USER.USERNAME_EMPTY, HTTP_STATUS.BAD_REQUEST);
    }

    if (username.length < 2 || username.length > 30) {
      throw new AppError(MESSAGES.USER.USERNAME_LENGTH, HTTP_STATUS.BAD_REQUEST);
    }

    // Check if user already exists with this username
    const existingUser = await this.userRepo.findByUsername(username);
    if (existingUser) {
      const updatedUser = await this.userRepo.updateLastSeen((existingUser._id).toString());
      return updatedUser || existingUser;
    }

    try {
      return await this.userRepo.create({ username });
    } catch (error: any) {
      if (error?.code === 11000) {
        throw new AppError(MESSAGES.USER.USERNAME_TAKEN, HTTP_STATUS.CONFLICT);
      }
      throw error;
    }
  }

  async getCurrentUser(userId: string): Promise<IUser | null> {
    if (!userId) return null;
    const user = await this.userRepo.findById(userId);
    if (user) {
      await this.userRepo.updateLastSeen(userId);
    }
    return user;
  }
}
