import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { HttpService } from '../../../infrastructure/http/http.abstract';
import {
  CallbackInterface,
  MethodInterface,
} from '../../shared/entities/route.entity';
import { RouteRepository } from '../../shared/repository/route.repository';

@Injectable()
export class ProcessRouteAction {
  private readonly logger = new Logger(ProcessRouteAction.name);

  constructor(
    private readonly routesRepository: RouteRepository,
    private readonly httpService: HttpService,
  ) {}

  execute(route: string, method: string, body: Record<string, any>) {
    const routeData = this.getRouteData(route, method);

    const formatedResponse = this.replacePlaceholdersInResponse(
      routeData.response_data,
      body,
    );

    this.logger.debug(`Route requested: ${route}`);
    this.logger.debug(`Triggered response: ${JSON.stringify(routeData)}`);

    if (routeData.callback) {
      this.processCallback(route, routeData.callback, body);
    }

    return {
      responseStatus: routeData.response_status,
      responseData: formatedResponse,
    };
  }

  private processCallback(
    route: string,
    routeDataCallback: CallbackInterface,
    requestBody: Record<string, any>,
  ) {
    const modifiedPayload = this.replacePlaceholdersInResponse(
      routeDataCallback.payload,
      requestBody,
    );

    setTimeout(() => {
      this.executeCallback(route, routeDataCallback, modifiedPayload);
    }, routeDataCallback.delay_ms);
  }

  private async executeCallback(
    route: string,
    callback: CallbackInterface,
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

  private getRouteData(route: string, method: string): MethodInterface {
    const routeData = this.routesRepository.getRoute(route);

    if (!routeData || !Object.hasOwn(routeData.data.method, method)) {
      throw new NotFoundException('Route not found');
    }

    return routeData.data.method[method];
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
