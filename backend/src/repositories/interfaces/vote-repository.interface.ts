import { IVote } from "../../models";
import { IBaseRepository } from "./base-repository.interface";

export interface IVoteRepository extends IBaseRepository<IVote> {
  findByUserAndPoll(userId: string, pollId: string): Promise<IVote | null>;
  createVote(userId: string, pollId: string, optionId: string): Promise<IVote>;
  updateVoteOption(userId: string, pollId: string, optionId: string): Promise<IVote | null>;
  deleteVote(userId: string, pollId: string): Promise<void>;
  getOptionVoteCounts(pollId: string): Promise<Record<string, number>>;
  getUserVotesForPolls(userId: string, pollIds: string[]): Promise<Record<string, string>>;
}