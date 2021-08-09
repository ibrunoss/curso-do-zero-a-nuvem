import Server from "./server/server";
import mainRouter from "./main.router";
import usersRouter from "./users/users.router";
import restaurantsRouter from "./restaurants/restaurants.router";
import environment from "./common/environment";
import reviewsRouter from "./reviews/reviews.router";

const server = new Server(environment.server.port, environment.db.url);

server
  .bootstrap([mainRouter, usersRouter, restaurantsRouter, reviewsRouter])
  .then(() =>
    console.log("Server is running on:", server.application.address())
  )
  .catch((err) => {
    console.log("Server failed to start");
    console.error(err);
    process.exit(1);
  });
