import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class I18nClientService {
  private readonly logger = new Logger(I18nClientService.name);

  async t(key: string, lang: string): Promise<string> {
    try {
      const res = await axios.get(`http://localhost:3000/i18n/${lang}/${key}`);
      return res.data?.text || key;
    } catch (e) {
      this.logger.error(`Translation error: ${key} (${lang})`);
      return key;
    }
  }
}
