import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { AppController } from './app.controller';
import { RouteService } from './route.service';
import { HealthController } from './health/health.controller';
import { RoutesRepositoryService } from './repository/routes.repository';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', `config/${process.env.NODE_ENV}.env`],
    }),
    HttpModule,
    TerminusModule,
  ],
  controllers: [HealthController, AppController],
  providers: [RouteService, RoutesRepositoryService],
})
export class AppModule {}
