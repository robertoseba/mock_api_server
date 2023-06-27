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

  getRoute(route: string, method: string) {
    const routeData = this.routesRepository.getRoute(route);
    if (!routeData) {
      return null;
    }

    return routeData.method[method];
  }

  createRoute(route: string, createRouteDTO: CreateRouteDTO): CreateRouteDTO {
    if (this.routesRepository.getRoute(route)) {
      throw new ConflictException('Route already exists');
    }
    return this.routesRepository.createRoute(route, createRouteDTO);
  }

  deleteRoute(route: string): boolean {
    if (!this.routesRepository.getRoute(route)) {
      throw new NotFoundException('Route not found');
    }
    return this.routesRepository.deleteRoute(route);
  }

  updateRoute(route: string, createRouteDTO: CreateRouteDTO): CreateRouteDTO {
    if (!this.routesRepository.getRoute(route)) {
      throw new NotFoundException('Route not found');
    }
    return this.routesRepository.updateRoute(route, createRouteDTO);
  }

  processRoute(route: string, method: string) {
    const routeData = this.getRoute(route, method);

    if (!routeData) {
      throw new NotFoundException('Route not found');
    }

    return {
      responseStatus: routeData.response_status,
      responseData: routeData.response_data,
    };
  }
}
