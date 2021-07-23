"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = require("../common/router");
const user_model_1 = require("./user.model");
class UsersRouter extends router_1.default {
    applyRoutes(application) {
        application.get("/users", (req, resp, next) => {
            user_model_1.default.findAll().then((users) => {
                resp.json(users);
                next();
            });
        });
    }
}
exports.default = new UsersRouter();
