import { RequestHandler } from "restify";
import { NotAuthorizedError } from "restify-errors";
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

        return next(false);
      } else {
        return next(new NotAuthorizedError("Invalid Credentials"));
      }
    })
    .catch(next);
};
