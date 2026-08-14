import { IPoll } from '../models/poll.model';
import { AppError } from '../utils/app-error';
import { pollDto, pollOptionsDto } from '../types/polls.dto';
import { IPollRepository } from '../repositories/interfaces/poll-repository.interfaces';
import { IVoteRepository } from '../repositories/interfaces/vote-repository.interface';
import { ISocketService } from './interfaces/socket-service.interfaces';
import { IPollService } from './interfaces/poll-service.interface';

export class PollService implements IPollService {

  constructor(
    private readonly _pollRepo: IPollRepository,
    private readonly _voteRepo: IVoteRepository,
    private readonly _socketService: ISocketService,
  ) {}

  async vote(userId: string, pollId: string, optionId: string): Promise<pollDto> {

    if (!userId) {
      throw new AppError('Unauthorized. Please join QuickPoll first.', 401);
    }

    if (!pollId || !optionId) {
      throw new AppError('Poll ID and Option ID are required', 400);
    }

    const poll = await this._pollRepo.findById(pollId);
    if (!poll) {
      throw new AppError('Poll not found', 404);
    }

    if (!poll.isActive) {
      throw new AppError('Poll is not active', 400);
    }

    // Does option belong to this poll
    const optionExists = poll.options.some((opt) => opt._id.toString() === optionId);
    if (!optionExists) {
      throw new AppError('Option does not belong to this poll', 400);
    }

    //Checking already voted
    const existingVote = await this._voteRepo.findByUserAndPoll(userId, pollId);
    if (existingVote) {
      throw new AppError('You have already voted on this poll', 400);
    }

    //Create vote
    await this._voteRepo.createVote(userId, pollId, optionId);

    //return result
    const updatedPoll = await this.getPollResult(poll, userId, optionId);

    // Broadcast updated poll without user-specific vote status
    const broadcastPoll = { ...updatedPoll, userVotedOptionId: null };
    this._socketService.emitPollUpdated(broadcastPoll);

    return updatedPoll;
  }

  private async getPollResult(
    poll: IPoll,
    userId?: string,
    votedOptionId?: string | null
  ): Promise<pollDto> {
    const pollIdStr = poll._id.toString();
    const counts = await this._voteRepo.getOptionVoteCounts(pollIdStr);
    const totalVotes = Object.values(counts).reduce((sum, c) => sum + c, 0);

    let userVotedOptionId: string | null = votedOptionId || null;

    if (!userVotedOptionId && userId) {
      const userVote = await this._voteRepo.findByUserAndPoll(userId, pollIdStr);
      if (userVote) {
        userVotedOptionId = userVote.optionId.toString();
      }
    }

    const options: pollOptionsDto[] = poll.options.map((opt) => {
      const optIdStr = opt._id.toString();
      const votesCount = counts[optIdStr] || 0;
      const percentage = totalVotes > 0 ? Math.round((votesCount / totalVotes) * 100) : 0;
      return {
        _id: optIdStr,
        text: opt.text,
        votesCount,
        percentage,
      };
    });

    return {
      _id: pollIdStr,
      question: poll.question,
      options,
      totalVotes,
      isActive: poll.isActive,
      userVotedOptionId,
      createdAt: poll.createdAt,
      updatedAt: poll.updatedAt,
    };
  }

  /**
   * Fetch all active polls with structured vote results.
   */
  async getActivePolls(userId?: string): Promise<pollDto[]> {
    const pollDocs = await this._pollRepo.findActivePolls();
    if (pollDocs.length === 0) return [];

    const pollIds = pollDocs.map((p) => p._id.toString());
    const userVotes = userId ? await this._voteRepo.getUserVotesForPolls(userId, pollIds) : {};

    const polls: pollDto[] = await Promise.all(
      pollDocs.map(async (poll) => {
        const pollIdStr = poll._id.toString();
        const votedOptionId = userVotes[pollIdStr] || null;
        return await this.getPollResult(poll, userId, votedOptionId);
      })
    );

    return polls;
  }
}