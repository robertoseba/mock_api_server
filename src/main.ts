import { NestFactory } from '@nestjs/core';
import { AppModule } from './application/app.module';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';

const PORT = process.env.PORT ? +process.env.PORT : 5000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(Logger));
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(PORT);
}
bootstrap();
