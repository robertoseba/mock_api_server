import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CoreModule } from './core/core.module';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', `config/${process.env.NODE_ENV}.env`],
    }),
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
    HttpModule,
    CoreModule,
  ],
})
export class AppModule {}
