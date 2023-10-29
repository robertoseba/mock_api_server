import { Module } from '@nestjs/common';
import { HttpService } from './http.abstract';
import { HttpAxiosService } from './httpAxios.service';

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
