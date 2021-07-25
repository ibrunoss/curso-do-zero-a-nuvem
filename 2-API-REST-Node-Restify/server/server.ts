import * as restify from "restify";
import * as mongoose from "mongoose";

import Router from "../common/router";
export default class Server {
  constructor(private port: number | string, private dbURL: string) {}

  application: restify.Server;

  initializeDB(): Promise<typeof mongoose> {
    return mongoose.connect(this.dbURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
  }

  initRoutes(routers: Router[]): Promise<any> {
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
      } catch (error) {
        reject(error);
      }
    });
  }

  bootstrap(routers: Router[] = []): Promise<Server> {
    return this.initializeDB().then(() =>
      this.initRoutes(routers).then(() => this)
    );
  }
}
