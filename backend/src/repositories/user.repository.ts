import { User, IUser } from '../models/user.model';

export class UserRepository {
  async create(username: string): Promise<IUser> {
    const user = new User({
      username,
      createdAt: new Date(),
      lastSeenAt: new Date(),
    });
    return await user.save();
  }

  async findById(id: string): Promise<IUser | null> {
    return await User.findById(id);
  }

  async findByUsername(username: string): Promise<IUser | null> {
    return await User.findOne({ username: username.toLowerCase() });
  }

  async updateLastSeen(id: string): Promise<IUser | null> {
    return await User.findByIdAndUpdate(
      id,
      { lastSeenAt: new Date() },
      { new: true }
    );
  }
}
