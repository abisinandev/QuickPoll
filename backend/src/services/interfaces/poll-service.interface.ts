import { pollDto, voteResultDto } from '../../types/polls.dto';

export interface IPollService {
    vote(
        userId: string,
        pollId: string,
        optionId: string
    ): Promise<voteResultDto>;

    getActivePolls(
        userId?: string
    ): Promise<pollDto[]>;
}