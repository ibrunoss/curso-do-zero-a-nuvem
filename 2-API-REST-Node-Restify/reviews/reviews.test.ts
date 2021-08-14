import request from "../common/request-test";

test("GET /reviews", async () => {
  const res = await request("/reviews", "get");

  expect(res.status).toBe(200);
  expect(res.items).toBeInstanceOf(Array);
});
