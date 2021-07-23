import * as restify from "restify";

import Router from "../common/router";
import User from "./user.model";

class UsersRouter extends Router {
  applyRoutes(application: restify.Server) {
    application.get("/users", (req, resp, next) => {
      User.findAll().then((users) => {
        resp.json(users);
        next();
      });
    });
  }
}

export default new UsersRouter();
