import { ConflictException, Injectable } from '@nestjs/common';
import { RouteRepository } from '../../core/repository/routes.repository';
import { CreateRouteDTO } from '../../core/dto/create_route_dto';

@Injectable()
export class CreateRouteAction {
  constructor(private readonly routesRepository: RouteRepository) {}

  execute(route: string, createRouteDTO: CreateRouteDTO): CreateRouteDTO {
    if (this.routesRepository.getRoute(route)) {
      throw new ConflictException('Route already exists');
    }
    return this.routesRepository.createRoute(route, createRouteDTO);
  }
}
