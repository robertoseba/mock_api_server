import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRouteDTO } from '../../shared/dto/create_route_dto';
import { RouteRepository } from '../../shared/repository/route.repository';

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
