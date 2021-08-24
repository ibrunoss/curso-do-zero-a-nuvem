"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const restify_errors_1 = require("restify-errors");
const authorize = (...profiles) => ({ authenticated }, res, next) => {
    if (authenticated !== undefined && authenticated.hasAny(...profiles)) {
        return next();
    }
    return next(new restify_errors_1.ForbiddenError("Permission denied"));
};
