import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { Repository } from 'typeorm';
import { Message } from 'src/messages/entities/message.entity';
@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  create(createClientDto: CreateClientDto) {
    return 'This action adds a new client';
  }

  async findAll() {
    try {
      // const findClients = await this.clientRepository
      //   .createQueryBuilder('client')
      //   .leftJoin(Message, 'message', 
      //     '(message.client_id = client.socket_id OR message.socket_id = client.socket_id)')
      //   .leftJoin('message.admin', 'admin')
      //   .select([
      //     'client.id',
      //     'client.created_at',
      //     'client.updated_at',
      //     'client.socket_id',
      //     'message.id AS messageId',
      //     'message.text AS lastMessage',
      //     'message.send_to AS sendTo',
      //     'message.client_id AS clientId',
      //     'message.created_at AS lastMessageDate',
      //     'admin.name AS adminName',
      //     'admin.id AS adminId'
      //   ])
      //   .where((qb) => {
      //     const subQuery = qb
      //       .subQuery()
      //       .select('MAX(m2.created_at)')
      //       .from(Message, 'm2')
      //       .where(
      //         '(m2.client_id = client.socket_id OR m2.socket_id = client.socket_id)'
      //       )
      //       .getQuery();
      //     return 'message.created_at = ' + subQuery;
      //   })
      //   .orderBy('message.created_at', 'DESC')
      //   .getRawMany();

      const findClients = await this.clientRepository
      .createQueryBuilder('client')
      .leftJoin(Message, 'message', 
        '(message.client_id = client.socket_id OR message.socket_id = client.socket_id OR message.send_to = client.socket_id)')
      .leftJoin('message.admin', 'admin')
      .select([
        'client.id',
        'client.created_at',
        'client.updated_at',
        'client.socket_id',
        'COALESCE(message.id, 0) AS messageId',
        'message.text AS lastMessage',
        'message.send_to AS sendTo',
        'message.client_id AS clientId',
        'COALESCE(message.created_at, client.created_at) AS lastMessageDate',
        'admin.name AS adminName',
        'admin.id AS adminId' 
      ])
      .where((qb) => {
        const subQuery = qb
          .subQuery()
          .select('MAX(m2.created_at)')
          .from(Message, 'm2')
          .where(
            '(m2.client_id = client.socket_id OR m2.socket_id = client.socket_id OR m2.send_to = client.socket_id)'
          )
          .getQuery();
        return 'message.created_at = ' + subQuery;
      })
      .orderBy('message.created_at', 'DESC')
      .getRawMany();


      return {
        success: true,
        data: findClients,
        message: 'Clients retrieved successfully',
      };
    } catch (error) {
      console.error('Error fetching clients:', error);
      throw new HttpException({
        success: false,
        message: 'Failed to fetch clients',
        error: error.message,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} client`;
  }

  update(id: number, updateClientDto: UpdateClientDto) {
    return `This action updates a #${id} client`;
  }

  remove(id: number) {
    return `This action removes a #${id} client`;
  }
}
