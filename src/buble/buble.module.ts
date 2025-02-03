import { Module } from '@nestjs/common';
import { BubleService } from './buble.service';
import { BubleController } from './buble.controller';

@Module({
  controllers: [BubleController],
  providers: [BubleService],
})
export class BubleModule {}
