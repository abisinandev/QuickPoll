import { pollDto } from '../../types/polls.dto';

export interface IPollService {
    vote(
        userId: string,
        pollId: string,
        optionId: string
    ): Promise<pollDto>;

    getActivePolls(
        userId?: string
    ): Promise<pollDto[]>;
}