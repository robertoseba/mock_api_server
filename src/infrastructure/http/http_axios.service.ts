import axios, { AxiosResponse } from 'axios';
import { HttpService } from './http.abstract';
import { InputHttpRequest } from './http.interfaces';
import * as https from "https";

export class HttpAxiosService implements HttpService {
  async request(input: InputHttpRequest): Promise<AxiosResponse<any, any>> {
    const httpsAgent = new https.Agent({
      rejectUnauthorized: false,
    });

    return await axios({
      method: input.method,
      url: input.url,
      data: input.data,
      responseType: 'json',
      httpsAgent: httpsAgent,
    });
  }
}