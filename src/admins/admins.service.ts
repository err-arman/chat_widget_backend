import { Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';
import { Repository } from 'typeorm';
import { UserType } from './admins.controller';

@Injectable()
export class AdminsService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
  ) {}

  async create(createAdminDto: UserType) {
    try {
      const findUser = await this.adminRepository.findOne({
        where: [
          { user_id: createAdminDto.id },
          { user_email: createAdminDto.email },
        ],
      });

      if (!findUser) {
        const { id,email, name, authProvider, profileImageUrl } =
          createAdminDto;

        const createdUser = await this.adminRepository.save({
          name:name,
          user_email: email,
          user_name: `${name.toLowerCase()}${Math.floor(Math.random() * 100)}`,
          user_id:id,
          authProvider: authProvider,
          profileImageUrl: profileImageUrl,
        });

        console.log('created user', createdUser);

        return {
          success: true,
          data: createdUser,
          message: 'User created successfully',
        };
      } else {
        return {
          success: true,
          data: findUser,
          message: 'User already created',
        };
      }
    } catch (error) {
      console.log('error', error);
      return {
        success: false,
        message:
          error?.message ||
          'Unknown error while trying to create user with clerk',
        data: error,
      };
    }
  }

  findAll() {
    return `This action returns all admins`;
  }

  async findOne(id: string) {
    try {
      if (!id) {
        return {
          success: false,
          message: 'clerk user id not found.',
        };
      }
      const findUser = await this.adminRepository.findOne({
        where: { user_id: id },
      });

      if (!findUser) {
        return {
          success: false,
          message: 'User not found.',
        };
      }

      return {
        success: true,
        message: 'User found.',
        data: findUser,
      };
    } catch (error) {
      console.log('error', error);
      return {
        success: false,
        message: error?.message || 'Unknown error while trying to fetch user',
        data: error,
      };
    }
  }

  update(id: number, updateAdminDto: UpdateAdminDto) {
    return `This action updates a #${id} admin`;
  }

  remove(id: number) {
    return `This action removes a #${id} admin`;
  }
}
