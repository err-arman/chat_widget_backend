import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsString,
} from '@nestjs/class-validator';

export class CreateMessageDto {
  @IsNotEmpty()
  @IsString()
  message: string; // The message content

  @IsNotEmpty()
  @IsString()
  sendFrom: string;

  @IsNotEmpty()
  @IsString()
  sendTo: string;
}
