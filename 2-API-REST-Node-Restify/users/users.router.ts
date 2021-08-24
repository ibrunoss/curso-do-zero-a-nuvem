import * as restify from "restify";

import ModelRouter from "../common/model-router";
import User from "./user.model";
import { authenticate, authorize } from "../security/auth.handler";
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
          handler: [authorize("admin"), findByEmail, findAll],
        },
      ])
    );

    application.get(`${this.basePath}/:id`, [
      authorize("admin"),
      validateId,
      findById,
    ]);
    application.post(this.basePath, [authorize("admin"), save]);
    application.post(`${this.basePath}/authenticate`, authenticate);
    application.put(`${this.basePath}/:id`, [
      authorize("admin"),
      validateId,
      replace,
    ]);
    application.patch(`${this.basePath}/:id`, [
      authorize("admin"),
      validateId,
      update,
    ]);
    application.del(`${this.basePath}/:id`, [
      authorize("admin"),
      validateId,
      remove,
    ]);
  }
}

export default new UsersRouter();
