import { Server as HttpServer } from 'http';
import { VoteRepository } from "../repositories/vote.repository";
import { SocketService } from "../services/socket.server";
import { PollService } from "../services/poll.service";
import { PollController } from "../controllers/poll.controller";
import { PollRepository } from "../repositories/poll.repository";
import { ChatRepository } from "../repositories/chat.repository";
import { ChatService } from "../services/chat.service";
import { ChatController } from "../controllers/chat.controller";
import { PollSeeder } from './seed-polls';

export const buildContainer = (httpServer: HttpServer) => {
    const pollRepository = new PollRepository();
    const voteRepository = new VoteRepository();
    
    const chatRepository = new ChatRepository();
    const chatService = new ChatService(chatRepository);
    const chatController = new ChatController(chatService);
    
    const socketService = new SocketService(httpServer, chatService);

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
        chatController,
        socketService
    };
};

export type Container = ReturnType<typeof buildContainer>;