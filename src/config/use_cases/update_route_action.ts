import { Injectable, NotFoundException } from '@nestjs/common';
import { RouteRepository } from '../../core/repository/routes.repository';
import { CreateRouteDTO } from '../../core/dto/create_route_dto';

@Injectable()
export class UpdateRouteAction {
  constructor(private readonly routesRepository: RouteRepository) {}

  execute(route: string, createRouteDTO: CreateRouteDTO): CreateRouteDTO {
    this.checkExists(route);
    return this.routesRepository.updateRoute(route, createRouteDTO);
  }

  private checkExists(route: string): void {
    if (!this.routesRepository.getRoute(route)) {
      throw new NotFoundException('Route not found');
    }
  }
}
