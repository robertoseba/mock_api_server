import { Module } from '@nestjs/common';
import { ConfigController } from './config.controller';
import { DeleteRouteAction } from './use_cases/delete_route_action';
import { UpdateRouteAction } from './use_cases/update_route_action';
import { CreateRouteAction } from './use_cases/create_route_action';
import { GetRouteAction } from './use_cases/get_route_action';
import { RouteRepository } from '../common/repository/routes.repository';
import { RouteMemoryRepository } from '../infrastructure/database/memory/routes.memory.repository';

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
