import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as chokidar from 'chokidar';
import Redis from 'ioredis';

@Injectable()
export class I18nService {
  private readonly logger = new Logger(I18nService.name);
  private translations = new Map<string, Record<string, string>>();
  private localesPath = path.resolve(process.env.I18N_DIR || './src/i18n/locales');
  private redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

  constructor() {
    this.loadAll();
    this.watch();
    this.subscribeToUpdates();
  }

  private loadAll() {
    const files = fs.readdirSync(this.localesPath);
    for (const file of files) {
      if (file.endsWith('.json')) {
        const lang = file.replace('.json', '');
        const content = JSON.parse(fs.readFileSync(path.join(this.localesPath, file), 'utf-8'));
        this.translations.set(lang, content);
      }
    }
    this.logger.log('Loaded translations: ' + [...this.translations.keys()].join(', '));
  }

  private watch() {
    chokidar.watch(this.localesPath).on('change', (file) => {
      const lang = path.basename(file, '.json');
      const content = JSON.parse(fs.readFileSync(file, 'utf-8'));
      this.translations.set(lang, content);
      this.redis.publish('i18n:reload', lang);
      this.logger.warn(`Translations reloaded for ${lang}`);
    });
  }

  private subscribeToUpdates() {
    const sub = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
    sub.subscribe('i18n:reload');
    sub.on('message', (channel, lang) => {
      if (channel === 'i18n:reload') {
        this.reloadLanguage(lang);
      }
    });
  }

  private reloadLanguage(lang: string) {
    const file = path.join(this.localesPath, `${lang}.json`);
    if (fs.existsSync(file)) {
      const content = JSON.parse(fs.readFileSync(file, 'utf-8'));
      this.translations.set(lang, content);
      this.logger.log(`✅ Reloaded translations for ${lang} (from Redis event)`);
    }
  }

  t(key: string, lang = 'en'): string {
    const dict = this.translations.get(lang);
    return dict?.[key] ?? key;
  }
  }
