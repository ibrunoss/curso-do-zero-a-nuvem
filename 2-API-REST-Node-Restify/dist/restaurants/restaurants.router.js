"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const restify_errors_1 = require("restify-errors");
const model_router_1 = require("../common/model-router");
const restaurants_model_1 = require("./restaurants.model");
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
    applyRoutes(application) {
        const { validateId, findAll, findById, save, replace, update, remove, findMenu, replaceMenu, } = this;
        application.get("/restaurants", findAll);
        application.get("/restaurants/:id", [validateId, findById]);
        application.get("/restaurants/:id/menu", [validateId, findMenu]);
        application.post("/restaurants", save);
        application.put("/restaurants/:id", [validateId, replace]);
        application.put("/restaurants/:id/menu", [validateId, replaceMenu]);
        application.patch("/restaurants/:id", [validateId, update]);
        application.del("/restaurants/:id", [validateId, remove]);
    }
}
exports.default = new RestaurantsRouter();
