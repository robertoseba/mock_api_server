import { Injectable, NotFoundException } from '@nestjs/common';
import { RouteRepository } from '../../core/repository/routes.repository';
import { CreateRouteDTO } from '../../core/dto/create_route_dto';

@Injectable()
export class GetRouteAction {
  constructor(private readonly routesRepository: RouteRepository) {}

  execute(route: string): CreateRouteDTO {
    const routeData = this.routesRepository.getRoute(route);

    if (!routeData) {
      throw new NotFoundException('Route not found');
    }

    return routeData;
  }
}
