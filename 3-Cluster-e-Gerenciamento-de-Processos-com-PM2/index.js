const restify = require("restify");

const app = restify.createServer();

app.use(restify.plugins.queryParser());

app.get("/", (req, res, next) => {
  for (let i = 0; i < 1e8; i++) {}

  res.json({ pid: process.pid, echo: req.query });
});

app.listen(4000, () => console.log("listening on port 4000"));
