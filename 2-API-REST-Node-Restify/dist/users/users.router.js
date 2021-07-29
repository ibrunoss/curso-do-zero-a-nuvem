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
        application.put("/users/:id", (req, resp, next) => {
            user_model_1.User.replaceOne({ _id: req.params.id }, req.body)
                .exec()
                .then((result) => {
                if (result.n) {
                    return user_model_1.User.findById(req.params.id);
                }
                resp.send(404);
            })
                .then((user) => {
                resp.json(user);
                return next();
            });
        });
        application.patch("/users/:id", (req, resp, next) => {
            const options = { new: true };
            user_model_1.User.findByIdAndUpdate(req.params.id, req.body, options).then((user) => {
                if (user) {
                    resp.json(user);
                    return next();
                }
                resp.send(404);
            });
        });
        application.del("/users/:id", (req, resp, next) => {
            const options = { new: true };
            user_model_1.User.remove({ _id: req.params.id })
                .exec()
                .then((result) => {
                if (result.n) {
                    resp.send(204);
                }
                else {
                    resp.send(404);
                }
                return next();
            });
        });
    }
}
exports.default = new UsersRouter();
