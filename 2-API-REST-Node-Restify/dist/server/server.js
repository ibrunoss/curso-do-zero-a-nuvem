"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const restify = require("restify");
const mongoose = require("mongoose");
const fs_1 = require("fs");
const merge_patch_parser_1 = require("./merge-patch.parser");
const error_handler_1 = require("./error.handler");
const token_parse_1 = require("../security/token.parse");
const logger_1 = require("../common/logger");
class Server {
    constructor(port, dbURL, certificate, key, enableHTTPS) {
        this.port = port;
        this.dbURL = dbURL;
        this.certificate = certificate;
        this.key = key;
        this.enableHTTPS = enableHTTPS;
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
                const options = {
                    name: "meat-api",
                    version: "1.0.0",
                    log: logger_1.default,
                };
                if (this.enableHTTPS) {
                    (options.certificate = fs_1.readFileSync(this.certificate)),
                        (options.key = fs_1.readFileSync(this.key));
                }
                this.application = restify.createServer(options);
                this.application.pre(restify.plugins.requestLogger({ log: logger_1.default }));
                this.application.use(restify.plugins.queryParser());
                this.application.use(restify.plugins.bodyParser());
                this.application.use(merge_patch_parser_1.mergePatchBodyParser);
                this.application.use(token_parse_1.default);
                //Routes
                for (let router of routers) {
                    router.applyRoutes(this.application);
                }
                this.application.on("restifyError", error_handler_1.default);
                this.application.on("after", restify.plugins.auditLogger({ log: logger_1.default, event: "after", body: true }));
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
