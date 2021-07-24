"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server/server");
const users_router_1 = require("./users/users.router");
const server = new server_1.default(process.env.SERVER_PORT || 3000, process.env.DB_URL || "mongodb://localhost/meat-api");
server
    .bootstrap([users_router_1.default])
    .then(() => console.log("Server is running on:", server.application.address()))
    .catch((err) => {
    console.log("Server failed to start");
    console.error(err);
    process.exit(1);
});
