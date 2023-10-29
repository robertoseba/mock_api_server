import {
  Body,
  Controller,
  Delete,
  Patch,
  Post,
  Req,
  Get,
} from '@nestjs/common';
import { Request } from 'express';
import { CreateRouteDTO } from './dto/create_route_dto';
import { CreateRouteAction } from './use_cases/create_route_action';
import { DeleteRouteAction } from './use_cases/delete_route_action';
import { UpdateRouteAction } from './use_cases/update_route_action';
import { GetRouteAction } from './use_cases/get_route_action';

@Controller('/management')
export class ManagementController {
  constructor(
    private readonly createAction: CreateRouteAction,
    private readonly deleteAction: DeleteRouteAction,
    private readonly updateAction: UpdateRouteAction,
    private readonly getAction: GetRouteAction,
  ) {}

  @Get('/*')
  getRoute(@Req() req: Request) {
    const route = req.params[0];
    return this.getAction.execute(route);
  }

  @Post('/*')
  addRoute(@Req() req: Request, @Body() createRouteDto: CreateRouteDTO) {
    const route = req.params[0];
    return this.createAction.execute(route, createRouteDto);
  }

  @Delete('/*')
  deleteRoute(@Req() req: Request) {
    const route = req.params[0];
    return this.deleteAction.execute(route);
  }

  @Patch('/*')
  PatchRoute(@Req() req: Request, @Body() createRouteDto: CreateRouteDTO) {
    const route = req.params[0];
    return this.updateAction.execute(route, createRouteDto);
  }
}
