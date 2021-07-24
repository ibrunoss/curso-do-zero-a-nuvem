import Server from "./server/server";
import usersRouter from "./users/users.router";

const server = new Server(
  process.env.SERVER_PORT || 3000,
  process.env.DB_URL || "mongodb://localhost/meat-api"
);

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
