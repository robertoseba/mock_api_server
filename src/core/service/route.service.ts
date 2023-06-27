import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { RouteRepository } from '../repository/routes.repository';
import {
  CallBackInfo,
  CreateRouteDTO,
  RouteInfo,
} from '../dto/create_route_dto';
import axios from 'axios';

@Injectable()
export class RouteService {
  private readonly logger = new Logger(RouteService.name);

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

    if (routeData.callback) {
      setTimeout(() => {
        this.processCallback(routeData.callback);
      }, routeData.callback.delay_ms);
    }

    return {
      responseStatus: routeData.response_status,
      responseData: routeData.response_data,
    };
  }

  private async processCallback(callback: CallBackInfo): Promise<void> {
    try {
      const response = await axios({
        method: callback.method,
        url: callback.url,
        data: callback.payload,
      });

      this.logger.debug(response.data);
    } catch (err) {
      this.logger.error(err);
    }
  }

  private getRouteData(route: string, method: string): RouteInfo {
    const routeData = this.routesRepository.getRoute(route);

    if (!routeData || !Object.hasOwn(routeData.method, method)) {
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
