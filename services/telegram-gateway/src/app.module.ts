import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TelegramController } from './telegram/telegram.controller';
import { TelegramService } from './telegram/telegram.service';
import { I18nClientService } from './common/i18n-client.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [TelegramController],
  providers: [TelegramService, I18nClientService],
})
export class AppModule {}
