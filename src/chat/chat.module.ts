// chat.module.ts
import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { MessagesModule } from '../messages/messages.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from 'src/messages/entities/message.entity';
import { MessagesService } from 'src/messages/messages.service';
import { ClientService } from 'src/client/client.service';
import { ClientModule } from 'src/client/client.module';
import { Client } from 'src/client/entities/client.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Message, Client]), MessagesModule, ClientModule],
  providers: [ChatGateway, MessagesService, ClientService],
  exports: [ChatGateway],
})
export class ChatModule {}