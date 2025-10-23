import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT || 3010);
  console.log(`✅ Telegram Gateway running on http://localhost:${process.env.PORT || 3010}`);
}
bootstrap();
