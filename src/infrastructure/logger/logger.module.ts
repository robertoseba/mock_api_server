import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        pinoHttp: {
          redact: ['[*].id'],
          level: config.get('NODE_ENV') !== 'production' ? 'debug' : 'info',
          transport: config.get('LOG_PRETTY')
            ? {
                target: 'pino-pretty',
                options: {
                  colorize: true,
                  singleLine: true,
                },
              }
            : undefined,
        },
      }),
    }),
  ],
})
export class CustomLoggerModule {}
