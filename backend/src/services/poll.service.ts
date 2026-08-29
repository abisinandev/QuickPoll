import { IPoll } from '../models/poll.model';
import { AppError } from '../utils/app-error';
import { pollDto, pollOptionsDto, voteResultDto, VoteAction } from '../types/polls.dto';
import { IPollRepository } from '../repositories/interfaces/poll-repository.interfaces';
import { IVoteRepository } from '../repositories/interfaces/vote-repository.interface';
import { ISocketService } from './interfaces/socket-service.interfaces';
import { IPollService } from './interfaces/poll-service.interface';
import { MESSAGES } from '../utils/messages';
import { HTTP_STATUS } from '../utils/http-status';

export class PollService implements IPollService {

  constructor(
    private readonly _pollRepo: IPollRepository,
    private readonly _voteRepo: IVoteRepository,
    private readonly _socketService: ISocketService,
  ) {}

  async vote(userId: string, pollId: string, optionId: string): Promise<voteResultDto> {

    if (!userId) {
      throw new AppError(MESSAGES.USER.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED);
    }

    if (!pollId || !optionId) {
      throw new AppError(MESSAGES.POLL.IDS_REQUIRED, HTTP_STATUS.BAD_REQUEST);
    }

    const poll = await this._pollRepo.findById(pollId);
    if (!poll) {
      throw new AppError(MESSAGES.POLL.NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    if (!poll.isActive) {
      throw new AppError(MESSAGES.POLL.NOT_ACTIVE, HTTP_STATUS.BAD_REQUEST);
    }

    // Does option belong to this poll
    const optionExists = poll.options.some((opt) => opt._id.toString() === optionId);
    if (!optionExists) {
      throw new AppError(MESSAGES.POLL.OPTION_NOT_FOUND, HTTP_STATUS.BAD_REQUEST);
    }

    const existingVote = await this._voteRepo.findByUserAndPoll(userId, pollId);

    let userVotedOptionId: string | null;
    let action: VoteAction;

    if (existingVote && existingVote.optionId.toString() === optionId) {
      // undo/redo
      await this._voteRepo.deleteVote(userId, pollId);
      userVotedOptionId = null;
      action = 'removed';

    } else if (existingVote) {

      await this._voteRepo.updateVoteOption(userId, pollId, optionId);
      userVotedOptionId = optionId;
      action = 'changed';

    } else {

      await this._voteRepo.createVote(userId, pollId, optionId);
      userVotedOptionId = optionId;
      action = 'added';

    }

    // Return result
    const updatedPoll = await this.getPollResult(poll, userId, userVotedOptionId);

    // Broadcast updated polls to everyone
    const broadcastPoll = { ...updatedPoll, userVotedOptionId: null };
    this._socketService.emitPollUpdated(broadcastPoll);

    return { poll: updatedPoll, action };
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