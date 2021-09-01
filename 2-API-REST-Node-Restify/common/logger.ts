import * as bunyan from "bunyan";

import environment from "./environment";

const logger = bunyan.createLogger({
  name: environment.log.name,
  level: environment.log.level,
});

export default logger;
