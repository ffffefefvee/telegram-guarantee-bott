import { Controller, Post, Body } from '@nestjs/common';
import { TelegramService } from './telegram.service';

@Controller('telegram')
export class TelegramController {
  constructor(private tg: TelegramService) {}

  @Post('update')
  async handleUpdate(@Body() body: any) {
    const result = await this.tg.handleUpdate(body);
    return result;
  }
}
