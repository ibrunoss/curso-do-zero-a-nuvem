import { RequestHandler, Request, Next } from "restify";
import * as jwt from "jsonwebtoken";

import User from "../users/user.model";
import environment from "../common/environment";

const tokenParser: RequestHandler = (req, res, next) => {
  const token = extractToken(req);

  if (token) {
    return jwt.verify(
      token,
      environment.security.apiSecret,
      applyBearer(req, next)
    );
  }

  next();
};

function extractToken(req: Request): string | undefined {
  //Authorization: Bearer TOKEN

  let token: string | undefined = undefined;

  const authorization: string = req.header("Authorization", "");
  const parts: string[] = authorization.split(" ");
  const isTokenBearer: boolean = parts.length === 2 && parts[0] === "Bearer";

  if (isTokenBearer) {
    token = parts[1];
  }

  return token;
}

function applyBearer(req: Request, next: Next): (error, decoded) => void {
  return async (error, decoded) => {
    if (decoded) {
      await User.findByEmail(decoded.sub)
        .then((user) => {
          if (user) {
            req.authenticated = user;
          }
        })
        .catch(next);
    }
    next();
  };
}

export default tokenParser;
