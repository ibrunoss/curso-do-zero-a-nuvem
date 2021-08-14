"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jestCli = require("jest-cli");
const server_1 = require("./server/server");
const user_model_1 = require("./users/user.model");
const users_router_1 = require("./users/users.router");
const reviews_model_1 = require("./reviews/reviews.model");
const reviews_router_1 = require("./reviews/reviews.router");
let server;
const beforeAllTests = () => {
    const db = process.env.DB_URL || "mongodb://localhost:27017/meat-api-test";
    const port = process.env.SERVER_PORT || 3001;
    server = new server_1.default(port, db);
    return server
        .bootstrap([users_router_1.default, reviews_router_1.default])
        .then(() => user_model_1.default.deleteMany({}).exec())
        .then(() => reviews_model_1.default.deleteMany({}).exec())
        .catch((err) => {
        console.log("Server failed to start");
        console.error(err);
        process.exit(1);
    });
};
const afterAllTests = () => server.shutdown();
beforeAllTests()
    .then(() => jestCli.run())
    .then(() => afterAllTests())
    .catch(console.error);
