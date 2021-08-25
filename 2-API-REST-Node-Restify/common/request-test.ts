import axios, { Method, AxiosRequestConfig } from "axios";

export default (
  endpoint: string,
  method: Method,
  data: any = undefined,
  headers?: any
): any => {
  const url = `http://localhost:3001${endpoint}`;
  const options: AxiosRequestConfig = { url, method, data };

  if (headers) {
    options.headers = headers;
  }

  return axios(options)
    .then((res) => ({ status: res.status, ...res.data }))
    .catch((err) => ({ status: err.response.status }));
};
