import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { I18nService } from '../i18n/i18n.service';

@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService, private readonly i18n: I18nService) {}

  @Post('from-telegram')
  async fromTelegram(@Body() body: any) {
    const from = body?.message?.from;
    if (!from) return { error: 'Invalid payload' };

    let user = await this.users.findByTelegramId(BigInt(from.id));
    if (!user) {
      user = await this.users.create({
        telegramId: BigInt(from.id),
        username: from.username,
        firstName: from.first_name,
        lastName: from.last_name,
        languageCode: from.language_code || 'en',
      });
    }

    const message = this.i18n.t('welcome', user.languageCode);
    return { user, message };
  }

  @Patch(':id/language')
  async changeLanguage(@Param('id') id: string, @Body('lang') lang: string) {
    const user = await this.users.setLanguage(id, lang);
    return { user, message: this.i18n.t('language.changed', lang) };
  }
}
