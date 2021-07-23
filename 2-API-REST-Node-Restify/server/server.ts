import * as restify from "restify";

export default class Server {
  constructor(private port: number | string = 3000) {}

  application: restify.Server;

  initRoutes(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.application = restify.createServer({
          name: "meat-api",
          version: "1.0.0",
        });

        this.application.use(restify.plugins.queryParser());

        //Routes
        this.application.get("/info", [
          (req, resp, next) => {
            if (req.userAgent() && req.userAgent().includes("MSIE 7.0")) {
              let error: any = new Error();
              error.statusCode = 500;
              error.message = "Please, update your browser";

              return next(error);
            }

            return next();
          },
          (req, resp, next) => {
            resp.json({
              browser: req.userAgent(),
              method: req.method,
              url: req.href(),
              path: req.path(),
              query: req.query,
            });
            return next();
          },
        ]);

        this.application.listen(this.port, () => resolve(this.application));
      } catch (error) {
        reject(error);
      }
    });
  }

  bootstrap(): Promise<Server> {
    return this.initRoutes().then(() => this);
  }
}
