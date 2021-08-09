import { Server, Request, Response, Next } from "restify";

import Router from "./common/router";

class MainRouter extends Router {
  constructor() {
    super();
  }

  applyRoutes(application: Server) {
    application.get("/", (req: Request, res: Response, next: Next) =>
      res.json({
        users: "/users",
        restaurants: "/restaurants",
        reviews: "/reviews",
      })
    );
  }
}

export default new MainRouter();
