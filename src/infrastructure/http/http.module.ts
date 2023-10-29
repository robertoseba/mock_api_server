import { Module } from '@nestjs/common';
import { HttpService } from './http.abstract';
import { HttpAxiosService } from './http_axios.service';

@Module({
  providers: [
    {
      provide: HttpService,
      useClass: HttpAxiosService,
    },
  ],
  exports: [HttpService],
})
export class HttpModule {}
