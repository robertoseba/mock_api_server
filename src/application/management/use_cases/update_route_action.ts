import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRouteDTO } from '../dto/create_route_dto';
import { RouteRepository } from '../../shared/repository/route.repository';
import { RouteEntity } from '../../shared/entities/route.entity';

@Injectable()
export class UpdateRouteAction {
  constructor(private readonly routesRepository: RouteRepository) {}

  execute(route: string, createRouteDTO: CreateRouteDTO): RouteEntity {
    this.checkExists(route);
    return this.routesRepository.updateRoute(route, createRouteDTO);
  }

  private checkExists(route: string): void {
    if (!this.routesRepository.getRoute(route)) {
      throw new NotFoundException('Route not found');
    }
  }
}
