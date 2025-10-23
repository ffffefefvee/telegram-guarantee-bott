import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { I18nClientService } from '../common/i18n-client.service';
import { TelegramUpdate } from './types';

@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);
  private readonly userServiceUrl = process.env.USER_SERVICE_URL;

  constructor(private i18n: I18nClientService) {}

  async handleUpdate(update: TelegramUpdate) {
    const message = update.message;
    const callback = update.callback_query;

    if (message) return this.handleMessage(message);
    if (callback) return this.handleCallback(callback);
  }

  private async handleMessage(msg: TelegramUpdate["message"]) {
    const text = msg.text || '';
    const userPayload = { message: { from: msg.from } };

    // Создаём/находим пользователя
    const res = await axios.post(`${this.userServiceUrl}/users/from-telegram`, userPayload);
    const user = res.data.user;
    const lang = user.languageCode || msg.from.language_code || 'en';

    if (text.startsWith('/start')) {
      const welcome = await this.i18n.t('welcome', lang);
      const chooseLang = await this.i18n.t('choose_language', lang);
      return {
        text: `${welcome}\n\n${chooseLang}`,
        keyboard: this.getLanguageKeyboard()
      };
    }

    if (text.startsWith('/language')) {
      const chooseLang = await this.i18n.t('choose_language', lang);
      return {
        text: chooseLang,
        keyboard: this.getLanguageKeyboard()
      };
    }

    return { text: 'Unknown command', keyboard: this.getLanguageKeyboard() };
  }

  private async handleCallback(callback: any) {
    const { from, data } = callback;
    const res = await axios.post(`${this.userServiceUrl}/users/from-telegram`, { message: { from } });
    const user = res.data.user;

    // Меняем язык пользователя
    await axios.patch(`${this.userServiceUrl}/users/${user.id}/language`, { lang: data });

    const confirm = await this.i18n.t('language.changed', data);
    return { text: confirm, keyboard: this.getLanguageKeyboard(data) };
  }

  private getLanguageKeyboard(selected?: string) {
    const buttons = [
      { text: selected === 'ru' ? '🇷🇺 Русский ✅' : '🇷🇺 Русский', callback_data: 'ru' },
      { text: selected === 'en' ? '🇬🇧 English ✅' : '🇬🇧 English', callback_data: 'en' },
      { text: selected === 'es' ? '🇪🇸 Español ✅' : '🇪🇸 Español', callback_data: 'es' }
    ];
    return { inline_keyboard: [buttons] };
  }
  }
