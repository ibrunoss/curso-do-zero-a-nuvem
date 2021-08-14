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
test("GET /users", () => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield request_test_1.default("/users", "get");
    expect(res.status).toBe(200);
    expect(res.items).toBeInstanceOf(Array);
}));
test("GET /users/aaaaa - Not Found", () => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield request_test_1.default("/users/aaaaa", "get");
    expect(res.status).toBe(404);
}));
test("POST /users", () => __awaiter(void 0, void 0, void 0, function* () {
    const user = {
        name: "Novo Usuário",
        email: "novo_usuario@email.com",
        password: "senha",
        cpf: "643.424.238-71",
    };
    const res = yield request_test_1.default("/users", "post", user);
    expect(res.status).toBe(200);
    expect(res._id).toBeDefined();
    expect(res.name).toBe(user.name);
    expect(res.email).toBe(user.email);
    expect(res.cpf).toBe(user.cpf);
    expect(res.password).toBeUndefined();
}));
test("PATCH /users/:id", () => __awaiter(void 0, void 0, void 0, function* () {
    const user = {
        name: "Usuário Patch",
        email: "usuario_patch@email.com",
        password: "senha",
    };
    const res1 = yield request_test_1.default("/users", "post", user);
    expect(res1.status).toBe(200);
    expect(res1._id).toBeDefined();
    expect(res1.name).toBe(user.name);
    expect(res1.email).toBe(user.email);
    expect(res1.password).toBeUndefined();
    const name = "Modificação do Usuário Patch";
    const res2 = yield request_test_1.default(`/users/${res1._id}`, "patch", { name });
    expect(res2.status).toBe(200);
    expect(res2._id).toBe(res1._id);
    expect(res2.name).toBe(name);
    expect(res2.email).toBe(user.email);
    expect(res2.password).toBeUndefined();
}));
