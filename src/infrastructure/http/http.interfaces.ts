export interface InputHttpRequest {
  method: string;
  url: string;
  data: Record<string | number, any>;
}
