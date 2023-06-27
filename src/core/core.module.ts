import { Module } from '@nestjs/common';
import { CoreController } from './core.controller';
import { RouteService } from './service/route.service';
import { RouteRepository } from './repository/routes.repository';
import { ConfigController } from './config.controller';

@Module({
  controllers: [ConfigController, CoreController],
  providers: [RouteService, RouteRepository],
})
export class CoreModule {}
