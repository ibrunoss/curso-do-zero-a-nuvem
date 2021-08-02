"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_router_1 = require("../common/model-router");
const user_model_1 = require("./user.model");
class UsersRouter extends model_router_1.default {
    constructor() {
        super(user_model_1.default);
        this.on("beforeRender", (document) => (document.password = undefined));
    }
    applyRoutes(application) {
        const { validateId, findAll, findById, save, replace, update, remove } = this;
        application.get("/users", findAll);
        application.get("/users/:id", [validateId, findById]);
        application.post("/users", save);
        application.put("/users/:id", [validateId, replace]);
        application.patch("/users/:id", [validateId, update]);
        application.del("/users/:id", [validateId, remove]);
    }
}
exports.default = new UsersRouter();
