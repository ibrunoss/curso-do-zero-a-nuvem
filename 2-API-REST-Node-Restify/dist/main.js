"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server/server");
const server = new server_1.default(process.env.SERVER_PORT);
server
    .bootstrap()
    .then(() => console.log("Server is running on:", server.application.address()))
    .catch((err) => {
    console.log("Server failed to start");
    console.error(err);
    process.exit(1);
});
