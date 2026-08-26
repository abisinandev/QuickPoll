import { Poll, IPoll } from '../models/poll.model';
import { BaseRepository } from './base.repository';
import { IPollRepository } from './interfaces/poll-repository.interfaces';

export class PollRepository extends BaseRepository<IPoll> implements IPollRepository {

  constructor() {
    super(Poll)
  }

  async findActivePolls(): Promise<IPoll[]> {
    return await this.model.find({ isActive: true }).sort({ createdAt: -1 });
  }

  async count(): Promise<number> {
    return await this.model.countDocuments();
  }

  async createMany(pollsData: Partial<IPoll>[]): Promise<IPoll[]> {
    return await this.model.insertMany(pollsData) as unknown as IPoll[];
  }

}