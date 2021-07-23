"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const restify = require("restify");
class Server {
    constructor(port = 3000) {
        this.port = port;
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
        return this.initRoutes(routers).then(() => this);
    }
}
exports.default = Server;
