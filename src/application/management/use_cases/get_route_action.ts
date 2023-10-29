import { Injectable, NotFoundException } from '@nestjs/common';
import { RouteRepository } from '../../shared/repository/route.repository';
import { RouteEntity } from '../../shared/entities/route.entity';

@Injectable()
export class GetRouteAction {
  constructor(private readonly routesRepository: RouteRepository) {}

  execute(route: string): RouteEntity {
    const routeData = this.routesRepository.getRoute(route);

    if (!routeData) {
      throw new NotFoundException('Route not found');
    }

    return routeData;
  }
}
