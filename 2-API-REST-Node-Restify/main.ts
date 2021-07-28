import Server from "./server/server";
import usersRouter from "./users/users.router";
import environment from "./common/environment";

const server = new Server(environment.server.port, environment.db.url);

server
  .bootstrap([usersRouter])
  .then(() =>
    console.log("Server is running on:", server.application.address())
  )
  .catch((err) => {
    console.log("Server failed to start");
    console.error(err);
    process.exit(1);
  });
