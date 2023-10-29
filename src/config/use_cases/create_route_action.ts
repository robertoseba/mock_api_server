import { ConflictException, Injectable } from '@nestjs/common';
import { CreateRouteDTO } from '../../common/dto/create_route_dto';
import { RouteRepository } from '../../common/repository/routes.repository';

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
