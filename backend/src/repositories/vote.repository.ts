import { IVote, Vote } from "../models/vote.model";
import { Types } from "mongoose";
import { BaseRepository } from "./base.repository";
import { IVoteRepository } from "./interfaces/vote-repository.interface";

export class VoteRepository
  extends BaseRepository<IVote>
  implements IVoteRepository {

  constructor() {
    super(Vote);
  }

  async findByUserAndPoll(
    userId: string,
    pollId: string
  ): Promise<IVote | null> {

    return this.model.findOne({
      userId: new Types.ObjectId(userId),
      pollId: new Types.ObjectId(pollId),
    });
  }

  async createVote(
    userId: string,
    pollId: string,
    optionId: string
  ): Promise<IVote> {

    const vote = new this.model({
      userId: new Types.ObjectId(userId),
      pollId: new Types.ObjectId(pollId),
      optionId: new Types.ObjectId(optionId),
      createdAt: new Date(),
    });

    return vote.save();
  }

  async updateVoteOption(
    userId: string,
    pollId: string,
    optionId: string
  ): Promise<IVote | null> {

    return this.model.findOneAndUpdate(
      {
        userId: new Types.ObjectId(userId),
        pollId: new Types.ObjectId(pollId),
      },
      {
        optionId: new Types.ObjectId(optionId),
      },
      { new: true }
    );
  }

  async deleteVote(
    userId: string,
    pollId: string
  ): Promise<void> {

    await this.model.deleteOne({
      userId: new Types.ObjectId(userId),
      pollId: new Types.ObjectId(pollId),
    });
  }

  async getVotesForPoll(
    pollId: string
  ): Promise<IVote[]> {

    return this.model.find({
      pollId: new Types.ObjectId(pollId),
    });
  }

  async getOptionVoteCounts(
    pollId: string
  ): Promise<Record<string, number>> {

    const aggregation = await this.model.aggregate([
      {
        $match: {
          pollId: new Types.ObjectId(pollId),
        },
      },
      {
        $group: {
          _id: "$optionId",
          count: { $sum: 1 },
        },
      },
    ]);

    const counts: Record<string, number> = {};

    for (const item of aggregation) {
      counts[item._id.toString()] = item.count;
    }

    return counts;
  }

  async getUserVotesForPolls(
    userId: string,
    pollIds: string[]
  ): Promise<Record<string, string>> {

    if (!userId || pollIds.length === 0) {
      return {};
    }

    const objectIds = pollIds.map(
      (id) => new Types.ObjectId(id)
    );

    const votes = await this.model.find({
      userId: new Types.ObjectId(userId),
      pollId: {
        $in: objectIds,
      },
    });

    const userVotes: Record<string, string> = {};

    for (const vote of votes) {
      userVotes[vote.pollId.toString()] =
        vote.optionId.toString();
    }

    return userVotes;
  }
}