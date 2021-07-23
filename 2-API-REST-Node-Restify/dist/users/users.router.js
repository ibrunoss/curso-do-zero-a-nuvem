"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = require("../common/router");
const user_model_1 = require("./user.model");
class UsersRouter extends router_1.default {
    applyRoutes(application) {
        application.get("/users", (req, resp, next) => {
            user_model_1.default.findAll().then((users) => {
                resp.json(users);
                return next();
            });
        });
        application.get("/users/:id", (req, resp, next) => {
            user_model_1.default.findByID(req.params.id).then((user) => {
                if (user) {
                    resp.json(user);
                    return next();
                }
                resp.send(404);
                return next();
            });
        });
    }
}
exports.default = new UsersRouter();
