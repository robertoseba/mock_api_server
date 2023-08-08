import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';

dotenv.config({
  path: `./${process.env.NODE_ENV}.env`,
});

const PORT = +process.env.PORT || 5000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger:
      process.env.NODE_ENV.toUpperCase() === 'DEVELOPMENT'
        ? ['debug', 'log', 'error', 'warn']
        : ['log', 'error', 'warn'],
  });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(PORT);
}
bootstrap();
