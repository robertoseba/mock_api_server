const allowedMethods = {
  POST: 'POST',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
  GET: 'GET',
} as const;

type methodKey = (typeof allowedMethods)[keyof typeof allowedMethods];

export interface CallbackInterface {
  url: string;
  payload: Record<any, unknown>;
  method: methodKey;
  delay_ms: number;
}

export interface MethodInterface {
  response_status: number;
  response_data: Record<any, unknown> | Array<Record<any, unknown>>;
  callback: CallbackInterface;
}

interface RouteInterface {
  url: string;
  method: {
    GET?: MethodInterface;
    POST?: MethodInterface;
    PATCH?: MethodInterface;
    DELETE?: MethodInterface;
  };
}

export class RouteEntity {
  constructor(public readonly data: RouteInterface) {}
}
