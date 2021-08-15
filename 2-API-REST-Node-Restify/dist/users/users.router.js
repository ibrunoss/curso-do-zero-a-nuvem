"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const restify = require("restify");
const model_router_1 = require("../common/model-router");
const user_model_1 = require("./user.model");
class UsersRouter extends model_router_1.default {
    constructor() {
        super(user_model_1.default);
        this.findByEmail = ({ query, url }, res, next) => {
            const { email } = query;
            if (!email) {
                return next();
            }
            user_model_1.default.findByEmail(email)
                .then((user) => (user ? [user] : []))
                .then(this.renderAll(res, next, {
                pageSize: this.pageSize,
                url,
            })).catch;
        };
        this.on("beforeRender", (document) => (document.password = undefined));
    }
    applyRoutes(application) {
        const { validateId, findAll, findByEmail, findById, save, replace, update, remove, } = this;
        application.get(this.basePath, restify.plugins.conditionalHandler([
            {
                version: "1.0.0",
                handler: findAll,
            },
            {
                version: "2.0.0",
                handler: [findByEmail, findAll],
            },
        ]));
        application.get(`${this.basePath}/:id`, [validateId, findById]);
        application.post(this.basePath, save);
        application.put(`${this.basePath}/:id`, [validateId, replace]);
        application.patch(`${this.basePath}/:id`, [validateId, update]);
        application.del(`${this.basePath}/:id`, [validateId, remove]);
    }
}
exports.default = new UsersRouter();
