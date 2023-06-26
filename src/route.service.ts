import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RoutesRepositoryService } from './repository/routes.repository';
import { CreateRouteDTO } from './dto/create_route_dto';

@Injectable()
export class RouteService {
  constructor(private readonly routesRepository: RoutesRepositoryService) {}

  getRoute(route: string) {
    return this.routesRepository.getRoute(route);
  }

  createRoute(route: string, createRouteDTO: CreateRouteDTO): CreateRouteDTO {
    if (this.getRoute(route)) {
      throw new HttpException('Route already exists', HttpStatus.BAD_REQUEST);
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
