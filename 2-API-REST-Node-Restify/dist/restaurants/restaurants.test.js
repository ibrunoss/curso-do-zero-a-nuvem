"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const request_test_1 = require("../common/request-test");
test("GET /restaurants", () => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield request_test_1.default("/restaurants", "get");
    expect(res.status).toBe(200);
    expect(res.items).toBeInstanceOf(Array);
}));
test("GET /restaurants/aaaaa - Not Found", () => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield request_test_1.default("/restaurants/aaaaa", "get");
    expect(res.status).toBe(404);
}));
test("POST /restaurants", () => __awaiter(void 0, void 0, void 0, function* () {
    const authUser = {
        email: "admin@fortest.com",
        password: "adminPass",
    };
    const auth = yield request_test_1.default("/users/authenticate", "post", authUser);
    expect(auth.status).toBe(200);
    expect(auth.accessToken).toBeDefined();
    const header = { Authorization: `Bearer ${auth.accessToken}` };
    const restaurant = {
        name: "Smash Burger House",
    };
    const res = yield request_test_1.default("/restaurants", "post", restaurant, header);
    expect(res.status).toBe(200);
    expect(res._id).toBeDefined();
    expect(res.name).toBe(restaurant.name);
}));
test("PATCH /restaurants/:id", () => __awaiter(void 0, void 0, void 0, function* () {
    const authUser = {
        email: "admin@fortest.com",
        password: "adminPass",
    };
    const auth = yield request_test_1.default("/users/authenticate", "post", authUser);
    expect(auth.status).toBe(200);
    expect(auth.accessToken).toBeDefined();
    const header = { Authorization: `Bearer ${auth.accessToken}` };
    const restaurant = {
        name: "Mana Burger House",
    };
    const res1 = yield request_test_1.default("/restaurants", "post", restaurant, header);
    expect(res1.status).toBe(200);
    expect(res1._id).toBeDefined();
    expect(res1.name).toBe(restaurant.name);
    const name = "Modificação do Restaurante";
    const res2 = yield request_test_1.default(`/restaurants/${res1._id}`, "patch", { name }, header);
    expect(res2.status).toBe(200);
    expect(res2._id).toBe(res1._id);
    expect(res2.name).toBe(name);
}));
test("PUT /restaurants/:id/menu", () => __awaiter(void 0, void 0, void 0, function* () {
    const authUser = {
        email: "admin@fortest.com",
        password: "adminPass",
    };
    const auth = yield request_test_1.default("/users/authenticate", "post", authUser);
    expect(auth.status).toBe(200);
    expect(auth.accessToken).toBeDefined();
    const header = { Authorization: `Bearer ${auth.accessToken}` };
    const restaurant = {
        name: "Burger Point",
    };
    const res1 = yield request_test_1.default("/restaurants", "post", restaurant, header);
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
    const res2 = yield request_test_1.default(`/restaurants/${res1._id}/menu`, "put", menu, header);
    expect(res2.status).toBe(200);
    expect(res2[0]._id).toBeDefined();
    expect(res2[0].name).toBe(menu[0].name);
    expect(res2[0].price).toBe(menu[0].price);
    expect(res2[1]._id).toBeDefined();
    expect(res2[1].name).toBe(menu[1].name);
    expect(res2[1].price).toBe(menu[1].price);
}));
