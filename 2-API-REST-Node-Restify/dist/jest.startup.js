"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jestCli = require("jest-cli");
const server_1 = require("./server/server");
const user_model_1 = require("./users/user.model");
const users_router_1 = require("./users/users.router");
const reviews_model_1 = require("./reviews/reviews.model");
const reviews_router_1 = require("./reviews/reviews.router");
const restaurants_model_1 = require("./restaurants/restaurants.model");
const restaurants_router_1 = require("./restaurants/restaurants.router");
let server;
const beforeAllTests = () => {
    const db = process.env.DB_URL || "mongodb://localhost:27017/meat-api-test";
    const port = process.env.SERVER_PORT || 3001;
    const certificate = process.env.CERT_FILE || "./security/keys/cert.pem";
    const key = process.env.CERT_KEY || "./security/keys/key.pem";
    const enableHTTPS = process.env.ENABLE_HTTPS
        ? !!parseInt(process.env.ENABLE_HTTPS)
        : false;
    server = new server_1.default(port, db, certificate, key, enableHTTPS);
    return server
        .bootstrap([users_router_1.default, reviews_router_1.default, restaurants_router_1.default])
        .then(() => user_model_1.default.deleteMany({}).exec())
        .then(() => {
        const user = new user_model_1.default();
        user.name = "User for tests";
        user.email = "user@fortest.com";
        user.password = "userPass";
        user.profiles = ["user"];
        return user.save();
    })
        .then(() => {
        const superUser = new user_model_1.default();
        superUser.name = "Super User for tests";
        superUser.email = "superUser@fortest.com";
        superUser.password = "superPass";
        superUser.profiles = ["admin", "user"];
        return superUser.save();
    })
        .then(() => {
        const admin = new user_model_1.default();
        admin.name = "Admin User for tests";
        admin.email = "admin@fortest.com";
        admin.password = "adminPass";
        admin.profiles = ["admin"];
        return admin.save();
    })
        .then(() => reviews_model_1.default.deleteMany({}).exec())
        .then(() => restaurants_model_1.default.deleteMany({}).exec())
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
