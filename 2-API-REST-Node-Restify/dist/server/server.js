"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const restify = require("restify");
const mongoose = require("mongoose");
const merge_patch_parser_1 = require("./merge-patch.parser");
const error_handler_1 = require("./error.handler");
class Server {
    constructor(port, dbURL) {
        this.port = port;
        this.dbURL = dbURL;
    }
    initializeDB() {
        return mongoose.connect(this.dbURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
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
                this.application.use(restify.plugins.bodyParser());
                this.application.use(merge_patch_parser_1.mergePatchBodyParser);
                //Routes
                for (let router of routers) {
                    router.applyRoutes(this.application);
                }
                this.application.on("restifyError", error_handler_1.default);
                this.application.listen(this.port, () => resolve(this.application));
            }
            catch (error) {
                reject(error);
            }
        });
    }
    shutdown() {
        return mongoose.disconnect().then(() => this.application.close());
    }
    bootstrap(routers = []) {
        return this.initializeDB().then(() => this.initRoutes(routers).then(() => this));
    }
}
exports.default = Server;
