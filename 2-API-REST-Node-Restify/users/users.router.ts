import * as restify from "restify";

import ModelRouter from "../common/model-router";
import User from "./user.model";

class UsersRouter extends ModelRouter<User> {
  constructor() {
    super(User);
    this.on("beforeRender", (document) => (document.password = undefined));
  }

  findByEmail = (
    { query, url }: restify.Request,
    res: restify.Response,
    next: restify.Next
  ) => {
    const { email } = query;

    if (!email) {
      return next();
    }

    User.findByEmail(email)
      .then((user) => (user ? [user] : []))
      .then(
        this.renderAll(res, next, {
          pageSize: this.pageSize,
          url,
        })
      ).catch;
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
      this.basePath,
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

    application.get(`${this.basePath}/:id`, [validateId, findById]);
    application.post(this.basePath, save);
    application.put(`${this.basePath}/:id`, [validateId, replace]);
    application.patch(`${this.basePath}/:id`, [validateId, update]);
    application.del(`${this.basePath}/:id`, [validateId, remove]);
  }
}

export default new UsersRouter();
