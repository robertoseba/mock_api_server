import axios, { AxiosResponse } from 'axios';
import { HttpService } from './http.abstract';
import { InputHttpRequest } from './http.interfaces';

export class HttpAxiosService implements HttpService {
  async request(input: InputHttpRequest): Promise<AxiosResponse<any, any>> {
    return await axios({
      method: input.method,
      url: input.url,
      data: input.data,
      responseType: 'json',
    });
  }
}
