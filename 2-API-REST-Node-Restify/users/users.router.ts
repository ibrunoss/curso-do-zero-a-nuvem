import * as restify from "restify";

import ModelRouter from "../common/model-router";
import User from "./user.model";

class UsersRouter extends ModelRouter<User> {
  constructor() {
    super(User);
    this.on("beforeRender", (document) => (document.password = undefined));
  }

  findByEmail = (
    { query }: restify.Request,
    res: restify.Response,
    next: restify.Next
  ) => {
    const { email } = query;

    if (!email) {
      return next();
    }

    User.find({ email }).then(this.renderAll(res, next)).catch;
  };

  applyRoutes(application: restify.Server) {
    const {
      validateId,
      findAll,
      findByEmail,
      findById,
      save,
      replace,
      update,
      remove,
    } = this;

    application.get(
      "/users",
      restify.plugins.conditionalHandler([
        {
          version: "1.0.0",
          handler: findAll,
        },
        {
          version: "2.0.0",
          handler: [findByEmail, findAll],
        },
      ])
    );

    application.get("/users/:id", [validateId, findById]);
    application.post("/users", save);
    application.put("/users/:id", [validateId, replace]);
    application.patch("/users/:id", [validateId, update]);
    application.del("/users/:id", [validateId, remove]);
  }
}

export default new UsersRouter();
