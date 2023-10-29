import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRouteDTO } from '../../common/dto/create_route_dto';
import { RouteRepository } from '../../common/repository/routes.repository';

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
