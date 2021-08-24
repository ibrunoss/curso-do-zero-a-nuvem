"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const restify_errors_1 = require("restify-errors");
const model_router_1 = require("../common/model-router");
const restaurants_model_1 = require("./restaurants.model");
const auth_handler_1 = require("../security/auth.handler");
class RestaurantsRouter extends model_router_1.default {
    constructor() {
        super(restaurants_model_1.default);
        this.findMenu = (req, res, next) => {
            restaurants_model_1.default.findById(req.params.id, "+menu")
                .then((restaurant) => {
                if (!restaurant) {
                    throw new restify_errors_1.NotFoundError("Restaurant not found");
                }
                res.json(restaurant.menu);
                return next();
            })
                .catch(next);
        };
        this.replaceMenu = (req, res, next) => {
            restaurants_model_1.default.findById(req.params.id)
                .then((restaurant) => {
                if (!restaurant) {
                    throw new restify_errors_1.NotFoundError("Restaurant not found");
                }
                restaurant.menu = req.body; //Deve ser um ARRAY de MenuItem
                return restaurant.save();
            })
                .then((restaurant) => {
                res.json(restaurant.menu);
                return next();
            })
                .catch(next);
        };
    }
    envelope(document) {
        const resource = super.envelope(document);
        resource._links.menu = `${resource._links.self}/menu`;
        return resource;
    }
    applyRoutes(application) {
        const { validateId, findAll, findById, save, replace, update, remove, findMenu, replaceMenu, } = this;
        application.get(this.basePath, findAll);
        application.get(`${this.basePath}/:id`, [validateId, findById]);
        application.get(`${this.basePath}/:id/menu`, [validateId, findMenu]);
        application.post(this.basePath, [auth_handler_1.authorize("admin"), save]);
        application.put(`${this.basePath}/:id`, [
            auth_handler_1.authorize("admin"),
            validateId,
            replace,
        ]);
        application.put(`${this.basePath}/:id/menu`, [
            auth_handler_1.authorize("admin"),
            validateId,
            replaceMenu,
        ]);
        application.patch(`${this.basePath}/:id`, [
            auth_handler_1.authorize("admin"),
            validateId,
            update,
        ]);
        application.del(`${this.basePath}/:id`, [
            auth_handler_1.authorize("admin"),
            validateId,
            remove,
        ]);
    }
}
exports.default = new RestaurantsRouter();
