"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const restify = require("restify");
const PORT = 3000;
const server = restify.createServer({
    name: "meat-api",
    version: "1.0.0",
});
server.get("/hello", (req, resp, next) => {
    resp.json({ message: "Hello Word!" });
    return next();
});
server.listen(PORT, () => console.log(`API is running on http://localhost:${PORT}`));
