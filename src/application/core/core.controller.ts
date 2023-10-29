import { All, Controller, Req, Res } from '@nestjs/common';
import { RouteService } from './service/route.service';
import { Request } from 'express';

@Controller()
export class CoreController {
  constructor(private readonly routeService: RouteService) {}

  @All('/*')
  mockApi(@Req() req: Request, @Res() res) {
    const { responseStatus, responseData } = this.routeService.processRoute(
      req.params[0],
      req.method,
      req.body,
    );
    return res.status(responseStatus).json(responseData);
  }
}
