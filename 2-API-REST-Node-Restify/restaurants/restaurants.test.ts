import request from "../common/request-test";

test("GET /restaurants", async () => {
  const res = await request("/restaurants", "get");

  expect(res.status).toBe(200);
  expect(res.items).toBeInstanceOf(Array);
});

test("GET /restaurants/aaaaa - Not Found", async () => {
  const res = await request("/restaurants/aaaaa", "get");

  expect(res.status).toBe(404);
});

test("POST /restaurants", async () => {
  const authUser = {
    email: "admin@fortest.com",
    password: "adminPass",
  };

  const auth = await request("/users/authenticate", "post", authUser);

  expect(auth.status).toBe(200);
  expect(auth.accessToken).toBeDefined();

  const header = { Authorization: `Bearer ${auth.accessToken}` };

  const restaurant = {
    name: "Smash Burger House",
  };

  const res = await request("/restaurants", "post", restaurant, header);

  expect(res.status).toBe(200);
  expect(res._id).toBeDefined();
  expect(res.name).toBe(restaurant.name);
});

test("PATCH /restaurants/:id", async () => {
  const authUser = {
    email: "admin@fortest.com",
    password: "adminPass",
  };

  const auth = await request("/users/authenticate", "post", authUser);

  expect(auth.status).toBe(200);
  expect(auth.accessToken).toBeDefined();

  const header = { Authorization: `Bearer ${auth.accessToken}` };

  const restaurant = {
    name: "Mana Burger House",
  };

  const res1 = await request("/restaurants", "post", restaurant, header);

  expect(res1.status).toBe(200);
  expect(res1._id).toBeDefined();
  expect(res1.name).toBe(restaurant.name);

  const name = "Modificação do Restaurante";

  const res2 = await request(
    `/restaurants/${res1._id}`,
    "patch",
    { name },
    header
  );

  expect(res2.status).toBe(200);
  expect(res2._id).toBe(res1._id);
  expect(res2.name).toBe(name);
});

test("PUT /restaurants/:id/menu", async () => {
  const authUser = {
    email: "admin@fortest.com",
    password: "adminPass",
  };

  const auth = await request("/users/authenticate", "post", authUser);

  expect(auth.status).toBe(200);
  expect(auth.accessToken).toBeDefined();

  const header = { Authorization: `Bearer ${auth.accessToken}` };

  const restaurant = {
    name: "Burger Point",
  };

  const res1 = await request("/restaurants", "post", restaurant, header);

  expect(res1.status).toBe(200);
  expect(res1._id).toBeDefined();
  expect(res1.name).toBe(restaurant.name);

  const menu = [
    {
      name: "Pork Burger",
      price: 22,
    },
    {
      name: "Coca-Cola",
      price: 5,
    },
  ];

  const res2 = await request(
    `/restaurants/${res1._id}/menu`,
    "put",
    menu,
    header
  );

  expect(res2.status).toBe(200);
  expect(res2[0]._id).toBeDefined();
  expect(res2[0].name).toBe(menu[0].name);
  expect(res2[0].price).toBe(menu[0].price);
  expect(res2[1]._id).toBeDefined();
  expect(res2[1].name).toBe(menu[1].name);
  expect(res2[1].price).toBe(menu[1].price);
});
