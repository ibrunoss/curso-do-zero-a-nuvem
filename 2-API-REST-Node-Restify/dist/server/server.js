"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const restify = require("restify");
const mongoose = require("mongoose");
const fs_1 = require("fs");
const merge_patch_parser_1 = require("./merge-patch.parser");
const error_handler_1 = require("./error.handler");
const token_parse_1 = require("../security/token.parse");
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
                    certificate: fs_1.readFileSync("./security/keys/cert.pem"),
                    key: fs_1.readFileSync("./security/keys/key.pem"),
                });
                this.application.use(restify.plugins.queryParser());
                this.application.use(restify.plugins.bodyParser());
                this.application.use(merge_patch_parser_1.mergePatchBodyParser);
                this.application.use(token_parse_1.default);
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
