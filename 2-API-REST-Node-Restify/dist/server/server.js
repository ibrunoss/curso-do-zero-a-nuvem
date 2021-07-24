"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const restify = require("restify");
const mongoose = require("mongoose");
class Server {
    constructor(port, dbURL) {
        this.port = port;
        this.dbURL = dbURL;
    }
    initializeDB() {
        return mongoose.connect(this.dbURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    }
    initRoutes(routers) {
        return new Promise((resolve, reject) => {
            try {
                this.application = restify.createServer({
                    name: "meat-api",
                    version: "1.0.0",
                });
                this.application.use(restify.plugins.queryParser());
                //Routes
                for (let router of routers) {
                    router.applyRoutes(this.application);
                }
                this.application.listen(this.port, () => resolve(this.application));
            }
            catch (error) {
                reject(error);
            }
        });
    }
    bootstrap(routers = []) {
        return this.initializeDB().then(() => this.initRoutes(routers).then(() => this));
    }
}
exports.default = Server;
