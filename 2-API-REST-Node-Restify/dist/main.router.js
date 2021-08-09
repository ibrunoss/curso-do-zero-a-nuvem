"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = require("./common/router");
class MainRouter extends router_1.default {
    constructor() {
        super();
    }
    applyRoutes(application) {
        application.get("/", (req, res, next) => res.json({
            users: "/users",
            restaurants: "/restaurants",
            reviews: "/reviews",
        }));
    }
}
exports.default = new MainRouter();
