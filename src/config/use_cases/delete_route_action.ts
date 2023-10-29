import { Injectable, NotFoundException } from '@nestjs/common';
import { RouteRepository } from '../../core/repository/routes.repository';

@Injectable()
export class DeleteRouteAction {
  constructor(private readonly routesRepository: RouteRepository) {}

  execute(route: string): boolean {
    this.checkExists(route);
    return this.routesRepository.deleteRoute(route);
  }

  private checkExists(route: string): void {
    if (!this.routesRepository.getRoute(route)) {
      throw new NotFoundException('Route not found');
    }
  }
}
