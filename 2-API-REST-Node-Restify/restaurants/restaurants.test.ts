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
  const restaurant = {
    name: "Smash Burger House",
  };

  const res = await request("/restaurants", "post", restaurant);

  expect(res.status).toBe(200);
  expect(res._id).toBeDefined();
  expect(res.name).toBe(restaurant.name);
});

test("PATCH /restaurants/:id", async () => {
  const restaurant = {
    name: "Mana Burger House",
  };

  const res1 = await request("/restaurants", "post", restaurant);

  expect(res1.status).toBe(200);
  expect(res1._id).toBeDefined();
  expect(res1.name).toBe(restaurant.name);

  const name = "Modificação do Restaurante";

  const res2 = await request(`/restaurants/${res1._id}`, "patch", { name });

  expect(res2.status).toBe(200);
  expect(res2._id).toBe(res1._id);
  expect(res2.name).toBe(name);
});

test("PUT /restaurants/:id/menu", async () => {
  const restaurant = {
    name: "Burger Point",
  };

  const res1 = await request("/restaurants", "post", restaurant);

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

  const res2 = await request(`/restaurants/${res1._id}/menu`, "put", menu);

  expect(res2.status).toBe(200);
  expect(res2[0]._id).toBeDefined();
  expect(res2[0].name).toBe(menu[0].name);
  expect(res2[0].price).toBe(menu[0].price);
  expect(res2[1]._id).toBeDefined();
  expect(res2[1].name).toBe(menu[1].name);
  expect(res2[1].price).toBe(menu[1].price);
});
