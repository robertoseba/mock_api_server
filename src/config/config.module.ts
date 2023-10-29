import { Module } from '@nestjs/common';
import { ConfigController } from '../config/config.controller';
import { RouteMemoryRepository } from '../infrastructure/database/memory/routes.memory.repository';
import { RouteRepository } from '../core/repository/routes.repository';
import { DeleteRouteAction } from './use_cases/delete_route_action';
import { UpdateRouteAction } from './use_cases/update_route_action';
import { CreateRouteAction } from './use_cases/create_route_action';
import { GetRouteAction } from './use_cases/get_route_action';

@Module({
  controllers: [ConfigController],
  providers: [
    { provide: RouteRepository, useClass: RouteMemoryRepository },
    DeleteRouteAction,
    UpdateRouteAction,
    CreateRouteAction,
    GetRouteAction,
  ],
})
export class ConfigModule {}
