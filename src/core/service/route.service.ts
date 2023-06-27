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

  createRoute(route: string, createRouteDTO: CreateRouteDTO): CreateRouteDTO {
    if (this.routesRepository.getRoute(route)) {
      throw new ConflictException('Route already exists');
    }
    return this.routesRepository.createRoute(route, createRouteDTO);
  }

  deleteRoute(route: string): boolean {
    this.checkExists(route);
    return this.routesRepository.deleteRoute(route);
  }

  updateRoute(route: string, createRouteDTO: CreateRouteDTO): CreateRouteDTO {
    this.checkExists(route);
    return this.routesRepository.updateRoute(route, createRouteDTO);
  }

  processRoute(route: string, method: string) {
    const routeData = this.getRouteData(route, method);

    return {
      responseStatus: routeData.response_status,
      responseData: routeData.response_data,
    };
  }

  private getRouteData(route: string, method: string) {
    const routeData = this.routesRepository.getRoute(route);
    if (!routeData || Object.hasOwn(routeData.method, method)) {
      throw new NotFoundException('Route not found');
    }

    return routeData.method[method];
  }

  private checkExists(route: string): void {
    if (!this.routesRepository.getRoute(route)) {
      throw new NotFoundException('Route not found');
    }
  }
}
