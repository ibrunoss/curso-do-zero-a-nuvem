"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server/server");
const users_router_1 = require("./users/users.router");
const environment_1 = require("./common/environment");
const server = new server_1.default(environment_1.default.server.port, environment_1.default.db.url);
server
    .bootstrap([users_router_1.default])
    .then(() => console.log("Server is running on:", server.application.address()))
    .catch((err) => {
    console.log("Server failed to start");
    console.error(err);
    process.exit(1);
});
