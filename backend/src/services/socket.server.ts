import { Server as SocketIoServer } from 'socket.io';
import { Server as HttpServer } from 'http';
import { sessionMiddleware } from '../configs/session'
import { pollDto } from '../types/polls.dto';
import { ISocketService } from './interfaces/socket-service.interfaces';
import { IChatService } from './interfaces/chat-service.interface';
import { MESSAGES } from '../utils/messages';

export class SocketService implements ISocketService {

    private io: SocketIoServer;
    private onlineUsers = new Map<string, number>();

    constructor(
        private readonly _httpServer: HttpServer,
        private readonly chatService?: IChatService
    ) {
        this.io = new SocketIoServer(this._httpServer, {
            cors: {
                origin: [
                    'http://localhost:3000',
                    'http://127.0.0.1:3000',
                ],
                credentials: true,
            }
        })

        this.io.engine.use(sessionMiddleware);
        this.init();
    }

    private init(): void {
        this.io.on('connection', (socket: any) => {

            const userId = socket.request.session?.userId;

            if (!userId) {
                console.log('Unauthenticated socket:', socket.id);
                socket.disconnect();
                return;
            }

            socket.data.userId = userId;

            const count = this.onlineUsers.get(userId) ?? 0;
            this.onlineUsers.set(userId, count + 1);

            this.io.emit('chat:onlineUsers', { count: this.onlineUsers.size });

            console.log(`User ${userId} connected: ${socket.id}`);

            socket.on('chat:send', async (data: { content: string }, callback: (res: any) => void) => {
                if (!this.chatService) return;
                try {
                    const message = await this.chatService.sendMessage(socket.data.userId, data.content);
                    this.io.emit('chat:message', message);
                    if (callback) callback({ success: true });
                } catch (error: any) {
                    if (callback) callback({ success: false, message: error.message || MESSAGES.CHAT.SEND_FAILED });
                }
            });

            socket.on('chat:typing', (data: { username: string }) => {
                socket.broadcast.emit('chat:userTyping', {
                    userId: socket.data.userId,
                    username: data.username
                });
            });

            socket.on('chat:stopTyping', () => {
                socket.broadcast.emit('chat:userStoppedTyping', {
                    userId: socket.data.userId
                });
            });

            socket.on('disconnect', () => {
                const currentCount = this.onlineUsers.get(userId) ?? 0;
                if (currentCount <= 1) {
                    this.onlineUsers.delete(userId);
                } else {
                    this.onlineUsers.set(userId, currentCount - 1);
                }
                this.io.emit('chat:onlineUsers', { count: this.onlineUsers.size });

                console.log(
                    `User ${socket.data.userId} disconnected`
                );
            });
        });
    }

    public emitPollUpdated(poll: pollDto): void {
        this.io.emit('poll:updated', poll);
    }
}