import { UserRepository } from '../repositories/user.repository';
import { IUser } from '../models/user.model';
import { AppError } from '../utils/app-error';

export class UserService {
  constructor(private userRepo: UserRepository) { }

  async joinGuest(username: string): Promise<IUser> {
    if (!username || typeof username !== 'string') {
      throw new AppError('Username is required', 400);
    }

    username = username.trim();

    if (username.length === 0) {
      throw new AppError('Username cannot be empty', 400);
    }

    if (username.length < 2 || username.length > 30) {
      throw new AppError('Username must be between 2 and 30 characters', 400);
    }

    // Check if user already exists with this username
    const existingUser = await this.userRepo.findByUsername(username);
    if (existingUser) {
      const updatedUser = await this.userRepo.updateLastSeen((existingUser._id).toString());
      return updatedUser || existingUser;
    }

    return await this.userRepo.create({ username });
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
