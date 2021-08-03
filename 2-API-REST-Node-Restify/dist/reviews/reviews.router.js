"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const model_router_1 = require("../common/model-router");
const reviews_model_1 = require("./reviews.model");
class ReviewsRouter extends model_router_1.default {
    constructor() {
        super(reviews_model_1.default);
    }
    prepareOne(query) {
        return query.populate("user", "name").populate("restaurant");
    }
    applyRoutes(application) {
        const { validateId, findAll, findById, save } = this;
        application.get("/reviews", findAll);
        application.get("/reviews/:id", [validateId, findById]);
        application.post("/reviews", save);
    }
}
exports.default = new ReviewsRouter();
