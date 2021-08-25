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
test("GET /reviews", () => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield request_test_1.default("/reviews", "get");
    expect(res.status).toBe(200);
    expect(res.items).toBeInstanceOf(Array);
}));
test("GET /reviews/aaaaa - Not Found", () => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield request_test_1.default("/reviews/aaaaa", "get");
    expect(res.status).toBe(404);
}));
test("POST /reviews - Without credentials", () => __awaiter(void 0, void 0, void 0, function* () {
    const review = {
        date: "2021-08-14T22:50:06",
        restaurant: "6108b2948649eb2eff8a35ee",
        user: "61016cc30c36037cab630885",
        rating: 4.8,
        comments: "Comida muito boa, atendimento rápido",
    };
    let res = yield request_test_1.default("/reviews", "post", review);
    expect(res.status).toBe(403);
}));
test("POST /reviews", () => __awaiter(void 0, void 0, void 0, function* () {
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
    const auth = yield request_test_1.default("/users/authenticate", "post", user);
    expect(auth.status).toBe(200);
    expect(auth.accessToken).toBeDefined();
    const header = { Authorization: `Bearer ${auth.accessToken}` };
    const res = yield request_test_1.default("/reviews", "post", review, header);
    expect(res.status).toBe(200);
    expect(res._id).toBeDefined();
    expect(res.date).toBe(new Date(review.date).toISOString());
    expect(res.restaurant).toBe(review.restaurant);
    expect(res.user).toBe(review.user);
    expect(res.rating).toBe(review.rating);
    expect(res.comments).toBe(review.comments);
}));
