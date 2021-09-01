import * as restify from "restify";
import * as mongoose from "mongoose";
import { readFileSync } from "fs";

import Router from "../common/router";
import { mergePatchBodyParser } from "./merge-patch.parser";
import handleError from "./error.handler";
import tokenParser from "../security/token.parse";
import log from "../common/logger";
export default class Server {
  constructor(
    private port: number | string,
    private dbURL: string,
    private certificate: string,
    private key: string,
    private enableHTTPS: boolean
  ) {}

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
        const options: restify.ServerOptions = {
          name: "meat-api",
          version: "1.0.0",
          log,
        };

        if (this.enableHTTPS) {
          (options.certificate = readFileSync(this.certificate)),
            (options.key = readFileSync(this.key));
        }

        this.application = restify.createServer(options);

        this.application.pre(restify.plugins.requestLogger({ log }));

        this.application.use(restify.plugins.queryParser());
        this.application.use(restify.plugins.bodyParser());
        this.application.use(mergePatchBodyParser);
        this.application.use(tokenParser);

        //Routes
        for (let router of routers) {
          router.applyRoutes(this.application);
        }

        this.application.on("restifyError", handleError);
        this.application.on(
          "after",
          restify.plugins.auditLogger({ log, event: "after", body: true })
        );

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
