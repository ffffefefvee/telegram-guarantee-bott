import { Controller, Get, Param } from '@nestjs/common';
import { I18nService } from './i18n.service';

@Controller('i18n')
export class I18nController {
  constructor(private i18n: I18nService) {}

  @Get(':lang/:key')
  getTranslation(@Param('lang') lang: string, @Param('key') key: string) {
    return { text: this.i18n.t(key, lang) };
  }
}
