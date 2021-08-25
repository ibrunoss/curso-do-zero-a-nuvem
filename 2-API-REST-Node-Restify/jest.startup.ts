import * as jestCli from "jest-cli";

import Server from "./server/server";
import User from "./users/user.model";
import usersRouter from "./users/users.router";
import Review from "./reviews/reviews.model";
import reviewsRouter from "./reviews/reviews.router";
import Restaurant from "./restaurants/restaurants.model";
import restaurantsRouter from "./restaurants/restaurants.router";

declare module "restify" {
  export interface Request {
    authenticated: User;
  }
}
let server: Server;

const beforeAllTests = () => {
  const db = process.env.DB_URL || "mongodb://localhost:27017/meat-api-test";
  const port = process.env.SERVER_PORT || 3001;
  const certificate = process.env.CERT_FILE || "./security/keys/cert.pem";
  const key = process.env.CERT_KEY || "./security/keys/key.pem";
  const enableHTTPS = process.env.ENABLE_HTTPS
    ? !!parseInt(process.env.ENABLE_HTTPS)
    : false;

  server = new Server(port, db, certificate, key, enableHTTPS);

  return server
    .bootstrap([usersRouter, reviewsRouter, restaurantsRouter])
    .then(() => User.deleteMany({}).exec())
    .then(() => {
      const user = new User();

      user.name = "User for tests";
      user.email = "user@fortest.com";
      user.password = "userPass";
      user.profiles = ["user"];

      return user.save();
    })
    .then(() => {
      const superUser = new User();

      superUser.name = "Super User for tests";
      superUser.email = "superUser@fortest.com";
      superUser.password = "superPass";
      superUser.profiles = ["admin", "user"];

      return superUser.save();
    })
    .then(() => {
      const admin = new User();

      admin.name = "Admin User for tests";
      admin.email = "admin@fortest.com";
      admin.password = "adminPass";
      admin.profiles = ["admin"];

      return admin.save();
    })
    .then(() => Review.deleteMany({}).exec())
    .then(() => Restaurant.deleteMany({}).exec())
    .catch((err) => {
      console.log("Server failed to start");
      console.error(err);
      process.exit(1);
    });
};

const afterAllTests = () => server.shutdown();

beforeAllTests()
  .then(() => jestCli.run())
  .then(() => afterAllTests())
  .catch(console.error);
