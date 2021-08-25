"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server/server");
const main_router_1 = require("./main.router");
const users_router_1 = require("./users/users.router");
const restaurants_router_1 = require("./restaurants/restaurants.router");
const environment_1 = require("./common/environment");
const reviews_router_1 = require("./reviews/reviews.router");
const server = new server_1.default(environment_1.default.server.port, environment_1.default.db.url, environment_1.default.security.certificate, environment_1.default.security.key, environment_1.default.security.enableHTTPS);
server
    .bootstrap([main_router_1.default, users_router_1.default, restaurants_router_1.default, reviews_router_1.default])
    .then(() => console.log("Server is running on:", server.application.address()))
    .catch((err) => {
    console.log("Server failed to start");
    console.error(err);
    process.exit(1);
});
