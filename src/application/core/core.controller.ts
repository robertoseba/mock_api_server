import { All, Controller, Req, Res } from '@nestjs/common';
import { ProcessRouteAction } from './use_cases/process_route_action';
import { Request } from 'express';

@Controller()
export class CoreController {
  constructor(private readonly processRouteAction: ProcessRouteAction) {}

  @All('/*')
  mockApi(@Req() req: Request, @Res() res) {
    const { responseStatus, responseData } = this.processRouteAction.execute(
      req.params[0],
      req.method,
      req.body,
    );
    return res.status(responseStatus).json(responseData);
  }
}
