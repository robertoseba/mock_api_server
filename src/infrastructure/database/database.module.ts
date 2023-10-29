import { Module } from '@nestjs/common';
import { RouteRepository } from '../../application/shared/repository/route.repository';
import { RouteMemoryRepository } from './memory/route.memory.repository';

@Module({
  providers: [{ provide: RouteRepository, useClass: RouteMemoryRepository }],
  exports: [RouteRepository],
})
export class DatabaseModule {}
