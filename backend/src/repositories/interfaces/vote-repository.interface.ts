import { IVote } from "../../models";
import { IBaseRepository } from "./base-repository.interface";

export interface IVoteRepository extends IBaseRepository<IVote> {
  findByUserAndPoll(userId: string, pollId: string): Promise<IVote | null>;
  createVote(userId: string, pollId: string, optionId: string): Promise<IVote>;
  getOptionVoteCounts(pollId: string): Promise<Record<string, number>>;
  getUserVotesForPolls(userId: string, pollIds: string[]): Promise<Record<string, string>>;
}