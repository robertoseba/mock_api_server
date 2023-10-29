import { CreateRouteDTO } from '../dto/create_route_dto';

export abstract class RouteRepository {
  abstract getRoute(route: string): CreateRouteDTO | null;

  abstract createRoute(
    route: string,
    createRouteDTO: CreateRouteDTO,
  ): CreateRouteDTO;

  abstract deleteRoute(route: string): boolean;

  abstract updateRoute(
    route: string,
    createRouteDTO: CreateRouteDTO,
  ): CreateRouteDTO;
}
