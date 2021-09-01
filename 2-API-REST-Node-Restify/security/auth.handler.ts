import { RequestHandler } from "restify";
import { ForbiddenError, NotAuthorizedError } from "restify-errors";
import * as jwt from "jsonwebtoken";

import User from "../users/user.model";
import environment from "../common/environment";

export const authenticate: RequestHandler = (req, res, next) => {
  const { email, password } = req.body;

  User.findByEmail(email, "+password")
    .then((user) => {
      if (user && user.matches(password)) {
        const accessToken = jwt.sign(
          { sub: user.email, iss: "meat-api" },
          environment.security.apiSecret
        );

        const { name, email } = user;

        res.json({ name, email, accessToken });

        next(false);
      }
      return next(new NotAuthorizedError("Invalid Credentials"));
    })
    .catch(next);
};

export const authorize: (...profiles: string[]) => RequestHandler =
  (...profiles) =>
  (req, res, next) => {
    const { authenticated, log, path } = req;
    if (authenticated !== undefined && authenticated.hasAny(...profiles)) {
      log.debug(
        "User %s is authorized with profiles %j on route %s. Required profiles: %j",
        authenticated._id,
        authenticated.profiles,
        req.path(),
        profiles
      );
      return next();
    }

    if (authenticated) {
      log.debug(
        "Permission denied for %s. Required profiles: %j. User profiles: %j",
        authenticated._id,
        profiles,
        authenticated.profiles
      );
    }

    next(new ForbiddenError("Permission denied"));
  };
