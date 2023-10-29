import { AxiosResponse } from 'axios';
import { InputHttpRequest } from './http.interfaces';

export abstract class HttpService {
  abstract request(input: InputHttpRequest): Promise<AxiosResponse<any, any>>;
}
