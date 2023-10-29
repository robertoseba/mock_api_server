import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { CoreModule } from './core/core.module';
import { ManagementModule } from './management/mgnt.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
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
    ManagementModule,
    CoreModule,
  ],
})
export class AppModule {}
