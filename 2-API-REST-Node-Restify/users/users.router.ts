import * as restify from "restify";

import ModelRouter from "../common/model-router";
import User from "./user.model";

class UsersRouter extends ModelRouter<User> {
  constructor() {
    super(User);
    this.on("beforeRender", (document) => (document.password = undefined));
  }
  applyRoutes(application: restify.Server) {
    const { validateId, findAll, findById, save, replace, update, remove } =
      this;

    application.get("/users", findAll);
    application.get("/users/:id", [validateId, findById]);
    application.post("/users", save);
    application.put("/users/:id", [validateId, replace]);
    application.patch("/users/:id", [validateId, update]);
    application.del("/users/:id", [validateId, remove]);
  }
}

export default new UsersRouter();
