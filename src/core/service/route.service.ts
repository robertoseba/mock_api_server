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
import { HttpService } from '../../infrastructure/http/http.abstract';

@Injectable()
export class RouteService {
  private readonly logger = new Logger(RouteService.name);

  constructor(
    private readonly routesRepository: RouteRepository,
    private readonly httpService: HttpService,
  ) {}

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

  processRoute(route: string, method: string, body: Record<string, any>) {
    const routeData = this.getRouteData(route, method);

    const formatedResponse = this.replacePlaceholdersInResponse(
      routeData.response_data,
      body,
    );

    this.logger.debug(`Route requested: ${route}`);
    this.logger.debug(`Triggered response: ${JSON.stringify(routeData)}`);

    if (routeData.callback) {
      const modifiedPayload = this.replacePlaceholdersInResponse(
        routeData.callback.payload,
        body,
      );

      setTimeout(() => {
        this.processCallback(route, routeData.callback, modifiedPayload);
      }, routeData.callback.delay_ms);
    }

    return {
      responseStatus: routeData.response_status,
      responseData: formatedResponse,
    };
  }

  getRoute(route: string): CreateRouteDTO {
    const routeData = this.routesRepository.getRoute(route);

    if (!routeData) {
      throw new NotFoundException('Route not found');
    }

    return routeData;
  }

  private async processCallback(
    route: string,
    callback: CallBackInfo,
    payload: Record<any, any>,
  ): Promise<void> {
    try {
      const response = await this.httpService.request({
        method: callback.method,
        url: callback.url,
        data: payload,
      });
      this.logger.debug(`Processing calllback from route: ${route}`);
      this.logger.debug(`${callback.method} -> ${callback.url}`);
      this.logger.debug(`Response status: ${response.status}`);
      this.logger.debug(JSON.stringify(payload));
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

  private replacePlaceholdersInResponse(
    routeResponse: Record<any, any>,
    postBody: Record<string, any>,
  ) {
    if (Object.keys(postBody).length === 0) {
      return routeResponse;
    }
    let stringData = JSON.stringify(routeResponse);
    Object.keys(postBody).forEach((key) => {
      stringData = stringData.replaceAll(
        `"<${key}>"`,
        JSON.stringify(postBody[key]),
      );
    });
    return JSON.parse(stringData);
  }
}
