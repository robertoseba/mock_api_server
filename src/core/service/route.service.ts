import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RouteRepository } from '../repository/routes.repository';
import { CreateRouteDTO } from '../dto/create_route_dto';

@Injectable()
export class RouteService {
  constructor(private readonly routesRepository: RouteRepository) {}

  getRoute(route: string) {
    return this.routesRepository.getRoute(route);
  }

  createRoute(route: string, createRouteDTO: CreateRouteDTO): CreateRouteDTO {
    if (this.getRoute(route)) {
      throw new ConflictException('Route already exists');
    }
    return this.routesRepository.createRoute(route, createRouteDTO);
  }

  deleteRoute(route: string): boolean {
    if (!this.getRoute(route)) {
      throw new NotFoundException('Route not found');
    }
    return this.routesRepository.deleteRoute(route);
  }

  updateRoute(route: string, createRouteDTO: CreateRouteDTO): CreateRouteDTO {
    if (!this.getRoute(route)) {
      throw new NotFoundException('Route not found');
    }
    return this.routesRepository.updateRoute(route, createRouteDTO);
  }
}
