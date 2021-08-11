import axios, { Method } from "axios";

import Server from "../server/server";
import usersRouter from "./users.router";
import User from "./user.model";

const request = (
  endpoint: string,
  method: Method,
  data: any = undefined
): any => {
  const url = `http://localhost:3001${endpoint}`;
  return axios({ url, method, data })
    .then((res) => ({ status: res.status, ...res.data }))
    .catch((err) => ({ status: err.response.status }));
};

let server: Server;

beforeAll(() => {
  const db = process.env.DB_URL || "mongodb://localhost:27017/meat-api-test";
  const port = process.env.SERVER_PORT || 3001;

  server = new Server(port, db);

  return server
    .bootstrap([usersRouter])
    .then(() => User.deleteMany({}).exec())
    .catch((err) => {
      console.log("Server failed to start");
      console.error(err);
      process.exit(1);
    });
});

test("GET /users", async () => {
  const res = await request("/users", "get");

  expect(res.status).toBe(200);
  expect(res.items).toBeInstanceOf(Array);
});

test("POST /users", async () => {
  const user = {
    name: "usuario1",
    email: "usuario1@email.com",
    password: "senha",
    cpf: "643.424.238-71",
  };

  const res = await request("/users", "post", user);

  expect(res.status).toBe(200);
  expect(res._id).toBeDefined();
  expect(res.name).toBe(user.name);
  expect(res.email).toBe(user.email);
  expect(res.cpf).toBe(user.cpf);
  expect(res.password).toBeUndefined();
});

afterAll(() => server.shutdown());
