"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_router_1 = require("../common/model-router");
const reviews_model_1 = require("./reviews.model");
const auth_handler_1 = require("../security/auth.handler");
class ReviewsRouter extends model_router_1.default {
    constructor() {
        super(reviews_model_1.default);
    }
    prepareOne(query) {
        return query.populate("user", "name").populate("restaurant");
    }
    envelope(document) {
        const resource = super.envelope(document);
        const restaurant = resource.restaurant._id || resource.restaurant;
        resource._links.restaurant = `/restaurants/${restaurant}`;
        return resource;
    }
    applyRoutes(application) {
        const { validateId, findAll, findById, save } = this;
        application.get(this.basePath, findAll);
        application.get(`${this.basePath}/:id`, [validateId, findById]);
        application.post(this.basePath, [auth_handler_1.authorize("user"), save]);
    }
}
exports.default = new ReviewsRouter();
