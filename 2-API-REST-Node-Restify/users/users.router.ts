import * as restify from "restify";

import Router from "../common/router";
import { User } from "./user.model";

class UsersRouter extends Router {
  applyRoutes(application: restify.Server) {
    application.get("/users", (req, resp, next) => {
      User.find().then((users) => {
        resp.json(users);
        return next();
      });
    });

    application.get("/users/:id", (req, resp, next) => {
      User.findById(req.params.id).then((user) => {
        if (user) {
          resp.json(user);
          return next();
        }
        resp.send(404);
        return next();
      });
    });

    application.post("/users", (req, resp, next) => {
      const user = new User(req.body);
      user.save().then((user) => {
        user.password = undefined;
        resp.json(user);
        return next();
      });
    });

    application.put("/users/:id", (req, resp, next) => {
      User.replaceOne({ _id: req.params.id }, req.body)
        .exec()
        .then((result) => {
          if (result.n) {
            return User.findById(req.params.id);
          }
          resp.send(404);
        })
        .then((user) => {
          resp.json(user);
          return next();
        });
    });

    application.patch("/users/:id", (req, resp, next) => {
      const options = { new: true };
      User.findByIdAndUpdate(req.params.id, req.body, options).then((user) => {
        if (user) {
          resp.json(user);
          return next();
        }
        resp.send(404);
      });
    });

    application.del("/users/:id", (req, resp, next) => {
      const options = { new: true };
      User.remove({ _id: req.params.id })
        .exec()
        .then((result) => {
          if (result.n) {
            resp.send(204);
          } else {
            resp.send(404);
          }
          return next();
        });
    });
  }
}

export default new UsersRouter();
