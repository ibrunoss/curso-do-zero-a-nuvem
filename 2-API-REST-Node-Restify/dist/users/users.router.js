"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = require("../common/router");
const user_model_1 = require("./user.model");
class UsersRouter extends router_1.default {
    applyRoutes(application) {
        application.get("/users", (req, resp, next) => {
            user_model_1.User.find().then((users) => {
                resp.json(users);
                return next();
            });
        });
        application.get("/users/:id", (req, resp, next) => {
            user_model_1.User.findById(req.params.id).then((user) => {
                if (user) {
                    resp.json(user);
                    return next();
                }
                resp.send(404);
                return next();
            });
        });
        application.post("/users", (req, resp, next) => {
            const user = new user_model_1.User(req.body);
            user.save().then((user) => {
                user.password = undefined;
                resp.json(user);
                return next();
            });
        });
    }
}
exports.default = new UsersRouter();
