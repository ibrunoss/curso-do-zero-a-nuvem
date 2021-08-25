import request from "../common/request-test";

test("GET /users", async () => {
  const authUser = {
    email: "admin@fortest.com",
    password: "adminPass",
  };

  const auth = await request("/users/authenticate", "post", authUser);

  expect(auth.status).toBe(200);
  expect(auth.accessToken).toBeDefined();

  const header = { Authorization: `Bearer ${auth.accessToken}` };

  const res = await request("/users", "get", undefined, header);

  expect(res.status).toBe(200);
  expect(res.items).toBeInstanceOf(Array);
});

test("GET /users/aaaaa - Not Found", async () => {
  const authUser = {
    email: "admin@fortest.com",
    password: "adminPass",
  };

  const auth = await request("/users/authenticate", "post", authUser);

  expect(auth.status).toBe(200);
  expect(auth.accessToken).toBeDefined();

  const header = { Authorization: `Bearer ${auth.accessToken}` };

  const res = await request("/users/aaaaa", "get", undefined, header);

  expect(res.status).toBe(404);
});

test("POST /users", async () => {
  const user = {
    name: "Novo Usuário",
    email: "novo_usuario@email.com",
    password: "senha",
    cpf: "643.424.238-71",
  };

  const authUser = {
    email: "admin@fortest.com",
    password: "adminPass",
  };

  const auth = await request("/users/authenticate", "post", authUser);

  expect(auth.status).toBe(200);
  expect(auth.accessToken).toBeDefined();

  const header = { Authorization: `Bearer ${auth.accessToken}` };

  const res = await request("/users", "post", user, header);

  expect(res.status).toBe(200);
  expect(res._id).toBeDefined();
  expect(res.name).toBe(user.name);
  expect(res.email).toBe(user.email);
  expect(res.cpf).toBe(user.cpf);
  expect(res.password).toBeUndefined();
});

test("POST /users - Without credentials", async () => {
  const user = {
    name: "Novo Usuário",
    email: "novo_usuario@email.com",
    password: "senha",
    cpf: "643.424.238-71",
  };

  const res = await request("/users", "post", user);

  expect(res.status).toBe(403);
});

test("POST /users - Without administrator credentials", async () => {
  const user = {
    name: "Novo Usuário",
    email: "novo_usuario@email.com",
    password: "senha",
    cpf: "643.424.238-71",
  };

  const authUser = {
    email: "user@fortest.com",
    password: "userPass",
  };

  const auth = await request("/users/authenticate", "post", authUser);

  expect(auth.status).toBe(200);
  expect(auth.accessToken).toBeDefined();

  const header = { Authorization: `Bearer ${auth.accessToken}` };

  const res = await request("/users", "post", user, header);

  expect(res.status).toBe(403);
});

test("PATCH /users/:id", async () => {
  const user = {
    name: "Usuário Patch",
    email: "usuario_patch@email.com",
    password: "senha",
  };

  const authUser = {
    email: "admin@fortest.com",
    password: "adminPass",
  };

  const auth = await request("/users/authenticate", "post", authUser);

  expect(auth.status).toBe(200);
  expect(auth.accessToken).toBeDefined();

  const header = { Authorization: `Bearer ${auth.accessToken}` };

  const res1 = await request("/users", "post", user, header);

  expect(res1.status).toBe(200);
  expect(res1._id).toBeDefined();
  expect(res1.name).toBe(user.name);
  expect(res1.email).toBe(user.email);
  expect(res1.password).toBeUndefined();

  const name = "Modificação do Usuário Patch";

  const res2 = await request(`/users/${res1._id}`, "patch", { name }, header);

  expect(res2.status).toBe(200);
  expect(res2._id).toBe(res1._id);
  expect(res2.name).toBe(name);
  expect(res2.email).toBe(user.email);
  expect(res2.password).toBeUndefined();
});
