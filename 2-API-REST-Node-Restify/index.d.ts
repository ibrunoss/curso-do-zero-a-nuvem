import User from "./users/user.model";

declare module "restify" {
  export interface Request {
    authenticated: User;
  }
}
