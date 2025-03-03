import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { v4 as uuidv4 } from 'uuid';

globalThis.crypto = {
  randomUUID: () => uuidv4(),
} as Crypto;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3339);
}
bootstrap();
