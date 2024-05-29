import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CustomLoggerModule } from '../infrastructure/logger/logger.module';
import { CoreModule } from './core/core.module';
import { ManagementModule } from './management/mgnt.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    ManagementModule,
    CustomLoggerModule,
    CoreModule,
  ],
})
export class AppModule {}
