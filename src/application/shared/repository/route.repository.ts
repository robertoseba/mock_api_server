import { CreateRouteDTO } from '../../management/dto/create_route_dto';
import { RouteEntity } from '../entities/route.entity';

export abstract class RouteRepository {
  abstract getRoute(route: string): RouteEntity | null;

  abstract createRoute(
    route: string,
    createRouteDTO: CreateRouteDTO,
  ): RouteEntity;

  abstract deleteRoute(route: string): boolean;

  abstract updateRoute(
    route: string,
    createRouteDTO: CreateRouteDTO,
  ): RouteEntity;
}
