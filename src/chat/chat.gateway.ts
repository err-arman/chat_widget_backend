import { InjectRepository } from '@nestjs/typeorm';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Client } from 'src/client/entities/client.entity';
import { Message } from 'src/messages/entities/message.entity';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@WebSocketGateway(8080, {
  cors: {
    origin: '*',
    credentials: true,
  },
})
export class ChatGateway {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,

    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}
  @WebSocketServer()
  server: Server;

  private clients = new Map<string, string>();
  private supportSessions = new Map<
    string,
    { supportId: string; visitorId: string }
  >();

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    console.log('paylaod', payload);
    return 'Hello world!';
  }

  handleConnection(client: Socket) {
    // Assign a unique visitor ID for anonymous users
    console.log('handle  connet', client.id);
    const visitorId = uuidv4();
    client.data.visitorId = visitorId;

    client.on('sendSocketId', (data) => {
      console.log('Received socket_id from frontend:', data);
      if (data.role === 'user') {
        this.clientRepository.save({ socket_id: data.socketId });
      }
    });
  }

  handleDisconnect(client: Socket) {
    console.log('handle disconnet');
    // Clean up any support sessions
    for (const [sessionKey, session] of this.supportSessions.entries()) {
      if (
        session.visitorId === client.data.visitorId ||
        session.supportId === client.id
      ) {
        this.supportSessions.delete(sessionKey);
      }
    }
  }

  @SubscribeMessage('register')
  registerClient(client: Socket, payload: { userId: string }) {
    this.clients.set(payload.userId, client.id);
  }

  @SubscribeMessage('supportMessage')
  handleSupportMessage(
    client: Socket,
    payload: {
      send_to: string;
      message: string;
      send_from: string;
      visitorId?: string;
    },
  ) {
    // If it's a message from the support agent
    if (payload.send_to === 'visitor') {
      // Find the session for this visitor
      const session = Array.from(this.supportSessions.values()).find(
        (s) => s.supportId === client.id,
      );

      if (session) {
        // Send message to visitor
        this.server.to(session.visitorId).emit('supportMessage', {
          from: 'support',
          message: payload.message,
        });
      }
      return;
    }

    // If it's a message from a visitor
    const supportSocketId = this.clients.get('10'); // Hardcoded support user ID

    if (supportSocketId) {
      // Create or find an existing support session
      const sessionKey = client.data.visitorId;
      if (!this.supportSessions.has(sessionKey)) {
        this.supportSessions.set(sessionKey, {
          supportId: supportSocketId,
          visitorId: client.data.visitorId,
        });
      }

      // Send message to support agent
      this.server.to(supportSocketId).emit('supportMessage', {
        from: client.data.visitorId,
        message: payload.message,
      });
    }
  }

  @SubscribeMessage('privetMessage')
  async sendPrivateMessage(
    client: Socket,
    payload: {
      send_to: string;
      message: string;
      send_from: string;
      first_message: boolean;
    },
  ) {
    if (payload.send_from) {
      console.log('send from', payload);

      this.messageRepository.save({ ...payload, text: payload.message });

      this.server.to(payload.send_to).emit(payload.send_to, {
        from: payload?.send_from,
        message: payload.message,
        first_messsage: payload.first_message
      });
    }
  }

  @SubscribeMessage('join')
  async joinRoom(client: Socket, room: string) {
    console.log('room id', room);

    client.join(room);
  }
}
