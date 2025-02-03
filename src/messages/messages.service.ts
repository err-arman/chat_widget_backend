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
        send_from: createMessageDto.sendFrom,
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
      if (!userId || !clientId?.length)
        return {
          success: false,
          message: `User id or client id missing`,
        };

        const messages = await this.messageRepository
        .createQueryBuilder('message')
        .select([
          'message.id as id',
          'message.created_at as created_at',
          'message.updated_at as updated_at',
          'message.text as text',
          'message.send_to as send_to',
          'message.send_from as send_from',
        ])
        .where(
          '(message.send_from = :userId AND message.send_to = :clientId) OR (message.send_from = :clientId AND message.send_to = :userId)',
          { userId, clientId }
        )
        .getRawMany();
      

      console.log('messages', messages);

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
