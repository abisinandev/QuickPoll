export interface pollOptionsDto {
  _id: string;
  text: string;
  votesCount: number;
  percentage: number;
}

export interface pollDto {
  _id: string;
  question: string;
  options: pollOptionsDto[];
  totalVotes: number;
  isActive: boolean;
  userVotedOptionId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type VoteAction = 'added' | 'changed' | 'removed';

export interface voteResultDto {
  poll: pollDto;
  action: VoteAction;
}
