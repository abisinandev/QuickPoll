export interface PollOption {
  _id: string;
  text: string;
  votesCount?: number;
  percentage?: number;
}

export interface Poll {
  _id: string;
  question: string;
  options: PollOption[];
  totalVotes?: number;
  userVotedOptionId?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
