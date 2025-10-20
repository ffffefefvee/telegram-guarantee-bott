import { Module, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';
import { I18nModule } from './i18n/i18n.module';
import { UsersModule } from './users/users.module';
import { TelegramUserMiddleware } from './common/middleware/telegram-user.middleware';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), I18nModule, UsersModule],
  providers: [PrismaService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TelegramUserMiddleware).forRoutes('*');
  }
}
