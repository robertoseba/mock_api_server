import { ConflictException, Injectable } from '@nestjs/common';
import { CreateRouteDTO } from '../../shared/dto/create_route_dto';
import { RouteRepository } from '../../shared/repository/route.repository';
import { RouteEntity } from '../../shared/entities/route.entity';

@Injectable()
export class CreateRouteAction {
  constructor(private readonly routesRepository: RouteRepository) {}

  execute(route: string, createRouteDTO: CreateRouteDTO): RouteEntity {
    if (this.routesRepository.getRoute(route)) {
      throw new ConflictException('Route already exists');
    }
    return this.routesRepository.createRoute(route, createRouteDTO);
  }
}
