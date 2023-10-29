import { Module } from '@nestjs/common';
import { CoreController } from './core.controller';
import { RouteService } from './service/route.service';
import { RouteRepository } from './repository/routes.repository';
import { ConfigController } from './config.controller';
import { HttpModule } from '../infrastructure/http/http.module';

@Module({
  imports: [HttpModule],
  controllers: [ConfigController, CoreController],
  providers: [RouteService, RouteRepository],
})
export class CoreModule {}
