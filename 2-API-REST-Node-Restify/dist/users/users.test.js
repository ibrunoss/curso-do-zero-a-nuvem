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
const axios_1 = require("axios");
const server_1 = require("../server/server");
const users_router_1 = require("./users.router");
const user_model_1 = require("./user.model");
const request = (endpoint, method, data = undefined) => {
    const url = `http://localhost:3001${endpoint}`;
    return axios_1.default({ url, method, data })
        .then((res) => (Object.assign({ status: res.status }, res.data)))
        .catch((err) => ({ status: err.response.status }));
};
let server;
beforeAll(() => {
    const db = process.env.DB_URL || "mongodb://localhost:27017/meat-api-test";
    const port = process.env.SERVER_PORT || 3001;
    server = new server_1.default(port, db);
    return server
        .bootstrap([users_router_1.default])
        .then(() => user_model_1.default.deleteMany({}).exec())
        .catch((err) => {
        console.log("Server failed to start");
        console.error(err);
        process.exit(1);
    });
});
test("GET /users", () => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield request("/users", "get");
    expect(res.status).toBe(200);
    expect(res.items).toBeInstanceOf(Array);
}));
test("POST /users", () => __awaiter(void 0, void 0, void 0, function* () {
    const user = {
        name: "usuario1",
        email: "usuario1@email.com",
        password: "senha",
        cpf: "643.424.238-71",
    };
    const res = yield request("/users", "post", user);
    expect(res.status).toBe(200);
    expect(res._id).toBeDefined();
    expect(res.name).toBe(user.name);
    expect(res.email).toBe(user.email);
    expect(res.cpf).toBe(user.cpf);
    expect(res.password).toBeUndefined();
}));
afterAll(() => server.shutdown());