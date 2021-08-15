import * as jestCli from "jest-cli";

import Server from "./server/server";
import User from "./users/user.model";
import usersRouter from "./users/users.router";
import Review from "./reviews/reviews.model";
import reviewsRouter from "./reviews/reviews.router";
import Restaurant from "./restaurants/restaurants.model";
import restaurantsRouter from "./restaurants/restaurants.router";

let server: Server;

const beforeAllTests = () => {
  const db = process.env.DB_URL || "mongodb://localhost:27017/meat-api-test";
  const port = process.env.SERVER_PORT || 3001;

  server = new Server(port, db);

  return server
    .bootstrap([usersRouter, reviewsRouter, restaurantsRouter])
    .then(() => User.deleteMany({}).exec())
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
