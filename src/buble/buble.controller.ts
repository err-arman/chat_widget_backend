import { Controller, Get, Res, Response, StreamableFile } from '@nestjs/common';
import { BubleService } from './buble.service';
import { createReadStream } from 'fs';
import { join } from 'path';

@Controller('buble')
export class BubleController {
  constructor(private readonly bubleService: BubleService) {}

  @Get()
  getFile(): StreamableFile {
    const file = createReadStream(join(process.cwd(), 'src/chat-widget.ts'));
    return new StreamableFile(file);
  }


  @Get('logo')
  getLogo(): StreamableFile {
    const file = createReadStream(join(process.cwd(), 'public/logo/kotha_logo.png')); // Adjust path to your image
    return new StreamableFile(file);
  }


}
