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

interface MessagePayload {
  send_to: string;
  message: string;
  send_to_socket_id: string;
  socket_id: string;
  first_message?: boolean; // Optional property
  client_id: string;
  user_id?: string; // Optional property
}

@WebSocketGateway({
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
    // console.log('paylaod', payload);
    return 'Hello world!';
  }

  handleConnection(client: Socket) {
    const visitorId = uuidv4();
    client.data.visitorId = visitorId;

    // Check if client already has a client_id in query params
    const existingClientId = client.handshake.query.client_id as string;
    if (existingClientId) {
      // Use the existing ID from localStorage
      client.data.clientId = existingClientId;
      // Update the database with this existing ID
      this.clientRepository
        .findOne({ where: { socket_id: existingClientId } })
        .then((dbClient) => {
          if (!dbClient) {
            // If not found, create new entry
            this.clientRepository.save({ socket_id: existingClientId });
          }
        });
    }
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

  @SubscribeMessage('sendSocketId')
  async handleClientId(
    client: Socket,
    data: { client_id: string; role: string },
  ) {
    if (data.role === 'user') {
      // Store the client ID in the client's data for future reference
      client.data.clientId = data.client_id;

      // Save to database
      const existingClient = await this.clientRepository.findOne({
        where: { socket_id: data.client_id },
      });

      if (!existingClient) {
        const newClient = { socket_id: data.client_id };
        await this.clientRepository.save(newClient);
        console.log('new-client', newClient);
        this.server.emit(`new-client`, newClient);
      }

      // Associate this socket with the client_id for messaging
      this.clients.set(data.client_id, client.id);

      // Join a room with the client_id as the room name for direct messaging
      client.join(data.client_id);
    }
  }

  @SubscribeMessage('register')
  registerClient(client: Socket, payload: { userId: string }) {
    this.clients.set(payload.userId, client.id);
  }

  @SubscribeMessage('message')
  handleNewMessage(client: Socket, payload: MessagePayload): void {
    console.log('payload  ', payload);
    if (payload.socket_id) {
      this.messageRepository.save({
        // admin: { admin: payload.user_id },
        ...payload,
        text: payload.message,
      });

      this.server
        .to(payload.send_to)
        .emit(payload.send_to, {
          socket_id: payload?.socket_id,
          message: payload.message,
          first_messsage: payload.first_message,
          client_id: payload.client_id,
        });
    }
  }

  @SubscribeMessage('join')
  async joinRoom(client: Socket, room: string) {
    client.join(room);
  }
}
