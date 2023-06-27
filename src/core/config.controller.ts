import {
  Body,
  Controller,
  Delete,
  Patch,
  Post,
  Req,
  Get,
} from '@nestjs/common';
import { RouteService } from './service/route.service';
import { Request } from 'express';
import { CreateRouteDTO } from './dto/create_route_dto';

@Controller('/config')
export class ConfigController {
  constructor(private readonly routeService: RouteService) {}

  @Get('/*')
  getRoute(@Req() req: Request) {
    const route = req.params[0];
    return this.routeService.getRoute(route);
  }

  @Post('/*')
  addRoute(@Req() req: Request, @Body() createRouteDto: CreateRouteDTO) {
    const route = req.params[0];
    return this.routeService.createRoute(route, createRouteDto);
  }

  @Delete('/*')
  deleteRoute(@Req() req: Request) {
    const route = req.params[0];
    return this.routeService.deleteRoute(route);
  }

  @Patch('/*')
  PatchRoute(@Req() req: Request, @Body() createRouteDto: CreateRouteDTO) {
    const route = req.params[0];
    return this.routeService.updateRoute(route, createRouteDto);
  }
}
