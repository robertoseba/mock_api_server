import { Module } from '@nestjs/common';
import { CoreController } from './core.controller';
import { RouteService } from './service/route.service';
import { RouteRepository } from './repository/routes.repository';

@Module({
  controllers: [CoreController],
  providers: [RouteService, RouteRepository],
})
export class CoreModule {}
