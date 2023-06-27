import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  ValidateNested,
  IsUrl,
  IsObject,
  Min,
  Max,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';
import { IsRestMethod } from './custom_validators/method_validator';

export class CallBackInfo {
  @IsNotEmpty()
  @IsUrl({ protocols: ['http', 'https'] })
  url: string;

  @IsNotEmpty()
  @IsObject()
  payload: Record<string, unknown>;

  @IsNotEmpty()
  @IsIn(['POST', 'PATCH', 'PUT', 'DELETE', 'GET'])
  method: string;

  @IsNotEmpty()
  @IsNumber()
  delay_ms: number;
}

export class RouteInfo {
  @IsNumber()
  @Min(200)
  @Max(500)
  @IsNotEmpty()
  response_status: number;

  @IsNotEmpty()
  response_data: Record<any, unknown> | Array<Record<any, unknown>>;

  @IsOptional()
  @ValidateNested()
  @Type(() => CallBackInfo)
  callback: CallBackInfo;
}

class MethodsInfo {
  @ValidateNested()
  @Type(() => RouteInfo)
  POST: RouteInfo;

  @ValidateNested()
  @Type(() => RouteInfo)
  GET: RouteInfo;

  @ValidateNested()
  @Type(() => RouteInfo)
  DELETE: RouteInfo;

  @ValidateNested()
  @Type(() => RouteInfo)
  PATCH: RouteInfo;
}

export class CreateRouteDTO {
  @ValidateNested()
  @IsNotEmpty()
  @IsRestMethod({
    message:
      'The data contains invalid methods. Allowed methods: GET, POST, PATCH, DELETE',
  })
  @Type(() => MethodsInfo)
  method: MethodsInfo;
}
