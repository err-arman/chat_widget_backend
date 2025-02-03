import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { Repository } from 'typeorm';

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
      const findClients = await this.clientRepository
        .createQueryBuilder('client')
        .select([
          'client.id as id',
          'client.created_at as created_at',
          'client.updated_at as updated_at',
          'client.socket_id as socket_id'
        ])
        .getRawMany();

      return {
        success: true,
        data: findClients,
        message: 'Clients retrieved successfully',
      };
    } catch (error) {
      // Log the error for debugging
      console.error('Error fetching clients:', error);

      // Throw a formatted error that can be caught by your exception filter
      throw new HttpException(
        {
          success: false,
          message: 'Failed to fetch clients',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
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
