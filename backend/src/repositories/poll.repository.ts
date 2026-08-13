import { Poll, IPoll } from '../models/poll.model';

export class PollRepository {
  async findById(id: string): Promise<IPoll | null> {
    return await Poll.findById(id);
  }

  async findActivePolls(): Promise<IPoll[]> {
    return await Poll.find({ isActive: true }).sort({ createdAt: -1 });
  }

  async count(): Promise<number> {
    return await Poll.countDocuments();
  }

  async createMany(pollsData: Partial<IPoll>[]): Promise<IPoll[]> {
    return await Poll.insertMany(pollsData) as unknown as IPoll[];
  }
}