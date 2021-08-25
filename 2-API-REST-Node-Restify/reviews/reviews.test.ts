import request from "../common/request-test";

test("GET /reviews", async () => {
  const res = await request("/reviews", "get");

  expect(res.status).toBe(200);
  expect(res.items).toBeInstanceOf(Array);
});

test("GET /reviews/aaaaa - Not Found", async () => {
  const res = await request("/reviews/aaaaa", "get");

  expect(res.status).toBe(404);
});

test("POST /reviews - Without credentials", async () => {
  const review = {
    date: "2021-08-14T22:50:06",
    restaurant: "6108b2948649eb2eff8a35ee",
    user: "61016cc30c36037cab630885",
    rating: 4.8,
    comments: "Comida muito boa, atendimento rápido",
  };

  let res = await request("/reviews", "post", review);

  expect(res.status).toBe(403);
});

test("POST /reviews", async () => {
  const review = {
    date: "2021-08-14T22:50:06",
    restaurant: "6108b2948649eb2eff8a35ee",
    user: "61016cc30c36037cab630885",
    rating: 4.8,
    comments: "Comida muito boa, atendimento rápido",
  };

  const user = {
    email: "user@fortest.com",
    password: "userPass",
  };

  const auth = await request("/users/authenticate", "post", user);

  expect(auth.status).toBe(200);
  expect(auth.accessToken).toBeDefined();

  const header = { Authorization: `Bearer ${auth.accessToken}` };

  const res = await request("/reviews", "post", review, header);

  expect(res.status).toBe(200);
  expect(res._id).toBeDefined();
  expect(res.date).toBe(new Date(review.date).toISOString());
  expect(res.restaurant).toBe(review.restaurant);
  expect(res.user).toBe(review.user);
  expect(res.rating).toBe(review.rating);
  expect(res.comments).toBe(review.comments);
});
