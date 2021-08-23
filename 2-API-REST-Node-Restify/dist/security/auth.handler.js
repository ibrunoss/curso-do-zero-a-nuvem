"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const restify_errors_1 = require("restify-errors");
const jwt = require("jsonwebtoken");
const user_model_1 = require("../users/user.model");
const environment_1 = require("../common/environment");
const authenticate = (req, res, next) => {
    const { email, password } = req.body;
    user_model_1.default.findByEmail(email, "+password")
        .then((user) => {
        if (user && user.matches(password)) {
            const accessToken = jwt.sign({ sub: user.email, iss: "meat-api" }, environment_1.default.security.apiSecret);
            const { name, email } = user;
            res.json({ name, email, accessToken });
            return next(false);
        }
        else {
            return next(new restify_errors_1.NotAuthorizedError("Invalid Credentials"));
        }
    })
        .catch(next);
};
exports.authenticate = authenticate;
