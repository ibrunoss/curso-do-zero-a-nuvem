import Server from "./server/server";

const server = new Server(process.env.SERVER_PORT);

server
  .bootstrap()
  .then(() =>
    console.log("Server is running on:", server.application.address())
  )
  .catch((err) => {
    console.log("Server failed to start");
    console.error(err);
    process.exit(1);
  });
