import { Module } from '@nestjs/common';
import { CoreController } from './core.controller';
import { RouteService } from './service/route.service';
import { HttpModule } from '../../infrastructure/http/http.module';
import { DatabaseModule } from '../../infrastructure/database/database.module';

@Module({
  imports: [HttpModule, DatabaseModule],
  controllers: [CoreController],
  providers: [RouteService],
})
export class CoreModule {}
