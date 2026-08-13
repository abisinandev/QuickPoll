import { Vote, IVote } from '../models/vote.model';
import { Types } from 'mongoose';

export class VoteRepository {
  async findByUserAndPoll(userId: string, pollId: string): Promise<IVote | null> {
    return await Vote.findOne({
      userId: new Types.ObjectId(userId),
      pollId: new Types.ObjectId(pollId),
    });
  }

  async createVote(userId: string, pollId: string, optionId: string): Promise<IVote> {
    const vote = new Vote({
      userId: new Types.ObjectId(userId),
      pollId: new Types.ObjectId(pollId),
      optionId: new Types.ObjectId(optionId),
      createdAt: new Date(),
    });
    return await vote.save();
  }

  async getVotesForPoll(pollId: string): Promise<IVote[]> {
    return await Vote.find({ pollId: new Types.ObjectId(pollId) });
  }

  async getOptionVoteCounts(pollId: string): Promise<Record<string, number>> {
    const aggregation = await Vote.aggregate([
      { $match: { pollId: new Types.ObjectId(pollId) } },
      { $group: { _id: '$optionId', count: { $sum: 1 } } },
    ]);

    const counts: Record<string, number> = {};
    for (const item of aggregation) {
      counts[item._id.toString()] = item.count;
    }
    return counts;
  }

  async getUserVotesForPolls(userId: string, pollIds: string[]): Promise<Record<string, string>> {
    if (!userId || pollIds.length === 0) return {};

    const objectIds = pollIds.map((id) => new Types.ObjectId(id));
    const votes = await Vote.find({
      userId: new Types.ObjectId(userId),
      pollId: { $in: objectIds },
    });

    const userVotes: Record<string, string> = {};
    for (const vote of votes) {
      userVotes[vote.pollId.toString()] = vote.optionId.toString();
    }
    return userVotes;
  }
}
