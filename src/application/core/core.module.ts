import { Module } from '@nestjs/common';
import { CoreController } from './core.controller';
import { ProcessRouteAction } from './use_cases/process_route_action';
import { HttpModule } from '../../infrastructure/http/http.module';
import { DatabaseModule } from '../../infrastructure/database/database.module';

@Module({
  imports: [HttpModule, DatabaseModule],
  controllers: [CoreController],
  providers: [ProcessRouteAction],
})
export class CoreModule {}
