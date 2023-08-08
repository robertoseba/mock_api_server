import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { validateOrReject } from 'class-validator';
import { readFile } from 'fs/promises';
import { CreateRouteDTO } from 'src/core/dto/create_route_dto';

@Injectable()
export class RouteRepository implements OnModuleInit {
  private readonly logger = new Logger(RouteRepository.name);
  private routes: Record<string, CreateRouteDTO> = {};

  async onModuleInit() {
    this.logger.debug('Pre-loading routes from json files...');
    try {
      const routes: Record<string, any>[] = JSON.parse(
        await readFile(`${__dirname}/../../../../mocks/mocks.json`, {
          encoding: 'utf8',
        }),
      );

      routes.forEach((route) => {
        const dto = new CreateRouteDTO();
        dto.method = route.method;
        validateOrReject(dto);

        const routeUrl =
          route?.url && route.url.startsWith('/')
            ? route.url.slice(1)
            : route.url;

        this.createRoute(routeUrl, dto);
        this.logger.debug(`Route /${routeUrl} loaded successfully!`);
      });
    } catch (err) {
      this.logger.error('Could not pre-load routes');
      this.logger.error(err);
    }
  }

  getRoute(route: string): CreateRouteDTO | null {
    if (!Object.hasOwn(this.routes, route)) {
      return null;
    }

    return this.routes[route];
  }

  createRoute(route: string, createRouteDTO: CreateRouteDTO): CreateRouteDTO {
    this.routes[route] = createRouteDTO;

    return this.routes[route];
  }

  deleteRoute(route: string): boolean {
    delete this.routes[route];

    return true;
  }

  updateRoute(route: string, createRouteDTO: CreateRouteDTO): CreateRouteDTO {
    return this.createRoute(route, createRouteDTO);
  }
}
