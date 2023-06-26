export class CreateRouteDTO {
  status_response: number;
  callback: {
    url: string;
    payload: Record<string, unknown>;
    method: string;
  };
}
