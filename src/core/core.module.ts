import { Module } from '@nestjs/common';
import { CoreController } from './core.controller';
import { RouteService } from './service/route.service';
import { RouteRepository } from './repository/routes.repository';
import { HttpModule } from '../infrastructure/http/http.module';
import { RouteMemoryRepository } from '../infrastructure/database/memory/routes.memory.repository';

@Module({
  imports: [HttpModule],
  controllers: [CoreController],
  providers: [
    RouteService,
    { provide: RouteRepository, useClass: RouteMemoryRepository },
  ],
})
export class CoreModule {}
