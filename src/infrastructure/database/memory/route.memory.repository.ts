import { join, resolve } from 'node:path';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { validateOrReject } from 'class-validator';
import { readFile } from 'fs/promises';
import { ConfigService } from '@nestjs/config';
import { CreateRouteDTO } from '../../../application/management/dto/create_route_dto';
import { RouteRepository } from '../../../application/shared/repository/route.repository';
import {
  MethodInterface,
  RouteEntity,
} from '../../../application/shared/entities/route.entity';

@Injectable()
export class RouteMemoryRepository implements RouteRepository, OnModuleInit {
  private readonly logger = new Logger(RouteMemoryRepository.name);

  private routes: Record<string, RouteEntity> = {};

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    try {
      const mockFilePath = this.configService.get('MOCK_FILE');
      if (!mockFilePath) {
        this.logger.debug(
          'No mock configuration especified. Skipping json file loading...',
        );
        return;
      }

      const filePath = resolve(join(__dirname, '../../../../', mockFilePath));

      this.logger.debug(`Pre-loading routes from json file: ${filePath}`);

      const routes: Record<string, any>[] = JSON.parse(
        await readFile(filePath, {
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

  getRoute(route: string): RouteEntity | null {
    if (!Object.hasOwn(this.routes, route)) {
      return null;
    }

    return this.routes[route];
  }

  createRoute(route: string, createRouteDTO: CreateRouteDTO): RouteEntity {
    this.routes[route] = new RouteEntity({
      url: route,
      method: {
        GET: createRouteDTO.method.GET as MethodInterface | undefined,
        PATCH: createRouteDTO.method.PATCH as MethodInterface | undefined,
        DELETE: createRouteDTO.method.DELETE as MethodInterface | undefined,
        POST: createRouteDTO.method.POST as MethodInterface | undefined,
      },
    });

    return this.routes[route];
  }

  deleteRoute(route: string): boolean {
    delete this.routes[route];

    return true;
  }

  updateRoute(route: string, createRouteDTO: CreateRouteDTO): RouteEntity {
    return this.createRoute(route, createRouteDTO);
  }
}
