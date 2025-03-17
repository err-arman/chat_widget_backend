import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Message } from './entities/message.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
  ) {}

  async create(createMessageDto: CreateMessageDto): Promise<Message> {
    try {
      // Create a new message instance
      const newMessage = this.messageRepository.create({
        text: createMessageDto.message,
        socket_id: createMessageDto.socket_id,
        send_to: createMessageDto.sendTo,
      });

      // Save the message to the database
      const savedMessage = await this.messageRepository.save(newMessage);

      if (!savedMessage) {
        throw new HttpException(
          'Failed to save message',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return savedMessage;
    } catch (error) {
      // Log the error for debugging (you should use a proper logger in production)
      console.error('Error creating message:', error);

      // Throw a generic error for unexpected cases
      throw new HttpException(
        'Failed to create message',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(userId: string, clientId: string) {
    try {
      if (!userId || !clientId?.length) {
        return {
          success: false,
          message: 'User id or client id missing',
        };
      }
  
      // console.log(`userId: ${userId} clientId: ${clientId}`);
      const messages = await this.messageRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.admin', 'admin')
      .select([
        'message.id as id',
        'message.created_at as created_at',
        'message.updated_at as updated_at',
        'message.text as text',
        'message.send_to as send_to',
        'message.socket_id as socket_id',
        'message.client_id as client_id',
        'admin.id as admin_id'
      ])
      .where(
        '(message.client_id = :clientId AND message.send_to = :userId) OR ' +
        '(message.socket_id = :clientId AND message.send_to = :userId) OR ' +
        '(message.socket_id = :userId AND message.client_id = :clientId) OR ' +
        '(message.send_to = :clientId AND message.client_id = :userId)',
        { userId, clientId }
      )
      .orderBy('message.created_at', 'ASC')
      .getRawMany();

      // console.log('message', messages)
  
      return {
        success: true,
        data: messages,
      };
    } catch (error) {
      console.error('Error finding message:', error);
  
      throw new HttpException(
        'Failed to find message',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  findOne(id: number) {
    return `This action returns a #${id} message`;
  }

  update(id: number, updateMessageDto: UpdateMessageDto) {
    return `This action updates a #${id} message`;
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }
}
