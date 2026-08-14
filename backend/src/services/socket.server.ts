import { Socket, Server as SocketIoServer } from 'socket.io';
import { Server as HttpServer } from 'http';
import { sessionMiddleware } from '../configs/session'
import { pollDto } from '../types/polls.dto';

export class SocketService {

    private io: SocketIoServer;

    constructor(
        private readonly _httpServer: HttpServer,
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

            console.log(`User ${userId} connected: ${socket.id}`);

            socket.on('disconnect', () => {
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