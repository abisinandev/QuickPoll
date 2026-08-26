import { pollDto } from "../../types/polls.dto";

export interface ISocketService {
  emitPollUpdated(poll: pollDto): void;
}