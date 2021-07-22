"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const restify = require("restify");
const PORT = 3000;
const server = restify.createServer({
    name: "meat-api",
    version: "1.0.0",
});
server.use(restify.plugins.queryParser());
server.get("/info", [
    (req, resp, next) => {
        if (req.userAgent() && req.userAgent().includes("MSIE 7.0")) {
            //resp.status(400);
            //resp.json({ message: "Please, update your browser" });
            //return next(false);
            let error = new Error();
            error.statusCode = 500;
            error.message = "Please, update your browser";
            return next(error);
        }
        return next();
    },
    (req, resp, next) => {
        //resp.status(200);
        //resp.statusMessage = "Ola mundo";
        //resp.setHeader("Content-Type", "application/jason");
        //resp.contentType = "application/jason";
        //resp.send({ message: "Hello Word!" });
        resp.json({
            browser: req.userAgent(),
            method: req.method,
            url: req.href(),
            path: req.path(),
            query: req.query,
        });
        return next();
    },
]);
server.listen(PORT, () => console.log(`API is running on http://localhost:${PORT}`));
