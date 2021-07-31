"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const restify_errors_1 = require("restify-errors");
const router_1 = require("../common/router");
const user_model_1 = require("./user.model");
class UsersRouter extends router_1.default {
    constructor() {
        super();
        this.on("beforeRender", (document) => (document.password = undefined));
    }
    applyRoutes(application) {
        application.get("/users", (req, resp, next) => {
            user_model_1.User.find().then(this.render(resp, next)).catch(next);
        });
        application.get("/users/:id", (req, resp, next) => {
            user_model_1.User.findById(req.params.id).then(this.render(resp, next)).catch(next);
        });
        application.post("/users", (req, resp, next) => {
            const user = new user_model_1.User(req.body);
            user.save().then(this.render(resp, next)).catch(next);
        });
        application.put("/users/:id", (req, resp, next) => {
            const options = { runValidators: true };
            user_model_1.User.replaceOne({ _id: req.params.id }, req.body, options)
                .exec()
                .then((result) => {
                if (result.n) {
                    return user_model_1.User.findById(req.params.id);
                }
                throw new restify_errors_1.NotFoundError("Documento não encontrado");
            })
                .then(this.render(resp, next))
                .catch(next);
        });
        application.patch("/users/:id", (req, resp, next) => {
            const options = { new: true, runValidators: true };
            user_model_1.User.findByIdAndUpdate(req.params.id, req.body, options)
                .then(this.render(resp, next))
                .catch(next);
        });
        application.del("/users/:id", (req, resp, next) => {
            user_model_1.User.remove({ _id: req.params.id })
                .exec()
                .then((result) => {
                if (result.n) {
                    resp.send(204);
                }
                else {
                    throw new restify_errors_1.NotFoundError("Documento não encontrado");
                }
                return next();
            })
                .catch(next);
        });
    }
}
exports.default = new UsersRouter();
