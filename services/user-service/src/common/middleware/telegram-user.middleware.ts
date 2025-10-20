import { Injectable, NestMiddleware } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TelegramUserMiddleware implements NestMiddleware {
  constructor(private prisma: PrismaService) {}

  async use(req: any, res: any, next: Function) {
    const body = req.body;
    const from = body?.message?.from;
    if (!from) return next();

    const telegramId = BigInt(from.id);
    let user = await this.prisma.user.findUnique({ where: { telegramId } });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          telegramId,
          username: from.username,
          firstName: from.first_name,
          lastName: from.last_name,
          languageCode: from.language_code || 'en',
        },
      });
    }

    req.user = user;
    req.lang = user.languageCode || 'en';
    next();
  }
}
