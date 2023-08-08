import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CoreModule } from './core/core.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', `config/${process.env.NODE_ENV}.env`],
    }),
    HttpModule,
    CoreModule,
  ],
})
export class AppModule {}
