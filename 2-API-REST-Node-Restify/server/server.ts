import * as restify from "restify";
import * as mongoose from "mongoose";
import { readFileSync } from "fs";

import Router from "../common/router";
import { mergePatchBodyParser } from "./merge-patch.parser";
import handleError from "./error.handler";
import tokenParser from "../security/token.parse";

export default class Server {
  constructor(private port: number | string, private dbURL: string) {}

  application: restify.Server;

  initializeDB(): Promise<typeof mongoose> {
    return mongoose.connect(this.dbURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
  }

  initRoutes(routers: Router[]): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.application = restify.createServer({
          name: "meat-api",
          version: "1.0.0",
          certificate: readFileSync("./security/keys/cert.pem"),
          key: readFileSync("./security/keys/key.pem"),
        });

        this.application.use(restify.plugins.queryParser());
        this.application.use(restify.plugins.bodyParser());
        this.application.use(mergePatchBodyParser);
        this.application.use(tokenParser);

        //Routes
        for (let router of routers) {
          router.applyRoutes(this.application);
        }

        this.application.on("restifyError", handleError);

        this.application.listen(this.port, () => resolve(this.application));
      } catch (error) {
        reject(error);
      }
    });
  }

  shutdown() {
    return mongoose.disconnect().then(() => this.application.close());
  }

  bootstrap(routers: Router[] = []): Promise<Server> {
    return this.initializeDB().then(() =>
      this.initRoutes(routers).then(() => this)
    );
  }
}
