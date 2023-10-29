import { Module } from '@nestjs/common';
import { ManagementController } from './mgnt.controller';
import { DeleteRouteAction } from './use_cases/delete_route_action';
import { UpdateRouteAction } from './use_cases/update_route_action';
import { CreateRouteAction } from './use_cases/create_route_action';
import { GetRouteAction } from './use_cases/get_route_action';
import { DatabaseModule } from '../../infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ManagementController],
  providers: [
    DeleteRouteAction,
    UpdateRouteAction,
    CreateRouteAction,
    GetRouteAction,
  ],
})
export class ManagementModule {}
