import { Injectable } from '@nestjs/common';
import { CreateRouteDTO } from 'src/core/dto/create_route_dto';

@Injectable()
export class RouteRepository {
  private routes: Record<string, CreateRouteDTO> = {};

  getRoute(route: string) {
    return this.routes[route];
  }

  createRoute(route: string, createRouteDTO: CreateRouteDTO): CreateRouteDTO {
    this.routes[route] = createRouteDTO;

    return this.routes[route];
  }

  deleteRoute(route: string): boolean {
    delete this.routes[route];
    console.log(this.routes);
    return true;
  }

  updateRoute(route: string, createRouteDTO: CreateRouteDTO): CreateRouteDTO {
    this.routes[route] = createRouteDTO;

    return this.routes[route];
  }
}
