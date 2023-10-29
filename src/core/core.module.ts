import { Module } from '@nestjs/common';
import { CoreController } from './core.controller';
import { RouteService } from './service/route.service';
import { RouteRepository } from './repository/routes.repository';
import { ConfigController } from './config.controller';
import { HttpModule } from '../infrastructure/http/http.module';
import { RouteMemoryRepository } from '../infrastructure/database/memory/routes.memory.repository';

@Module({
  imports: [HttpModule],
  controllers: [ConfigController, CoreController],
  providers: [
    RouteService,
    { provide: RouteRepository, useClass: RouteMemoryRepository },
  ],
})
export class CoreModule {}
