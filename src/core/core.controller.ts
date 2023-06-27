import {
  All,
  Body,
  Controller,
  Delete,
  NotFoundException,
  Patch,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { RouteService } from './service/route.service';
import { Request } from 'express';
import { CreateRouteDTO } from './dto/create_route_dto';

@Controller()
export class CoreController {
  constructor(private readonly routeService: RouteService) {}

  @Post('/add/*')
  addRoute(@Req() req: Request, @Body() createRouteDto: CreateRouteDTO) {
    const route = req.params[0];
    return this.routeService.createRoute(route, createRouteDto);
  }

  @Delete('/remove/*')
  deleteRoute(@Req() req: Request) {
    const route = req.params[0];
    return this.routeService.deleteRoute(route);
  }

  @Patch('/update/*')
  PatchRoute(@Req() req: Request, @Body() createRouteDto: CreateRouteDTO) {
    const route = req.params[0];
    return this.routeService.updateRoute(route, createRouteDto);
  }

  @All('/*')
  mockApi(@Req() req: Request, @Res() res) {
    const { responseStatus, responseData } = this.routeService.processRoute(
      req.params[0],
      req.method,
    );

    return res.status(responseStatus).json(responseData);
  }
}
