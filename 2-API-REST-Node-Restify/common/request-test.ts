import axios, { Method } from "axios";

export default (
  endpoint: string,
  method: Method,
  data: any = undefined
): any => {
  const url = `http://localhost:3001${endpoint}`;
  return axios({ url, method, data })
    .then((res) => ({ status: res.status, ...res.data }))
    .catch((err) => ({ status: err.response.status }));
};
