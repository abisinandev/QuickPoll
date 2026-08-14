import { Server as HttpServer } from 'http';
import { VoteRepository } from "../repositories/vote.repository";
import { SocketService } from "../services/socket.server";
import { PollService } from "../services/poll.service";
import { PollController } from "../controllers/poll.controller";
import { PollRepository } from "../repositories/poll.repository";
import { PollSeeder } from './seed-polls';

export const buildContainer = (httpServer: HttpServer) => {
    const pollRepository = new PollRepository();
    const voteRepository = new VoteRepository();
    const socketService = new SocketService(httpServer);

    const pollService = new PollService(
        pollRepository,
        voteRepository,
        socketService
    );

    const pollController = new PollController(pollService);
    const pollSeeder = new PollSeeder(pollRepository);

    return {
        pollController,
        pollSeeder,
        socketService
    };
};

export type Container = ReturnType<typeof buildContainer>;