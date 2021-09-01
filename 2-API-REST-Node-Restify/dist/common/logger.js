"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bunyan = require("bunyan");
const environment_1 = require("./environment");
const logger = bunyan.createLogger({
    name: environment_1.default.log.name,
    level: environment_1.default.log.level,
});
exports.default = logger;
