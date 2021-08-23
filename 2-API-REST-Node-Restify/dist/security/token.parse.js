"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jsonwebtoken");
const user_model_1 = require("../users/user.model");
const environment_1 = require("../common/environment");
const tokenParser = (req, res, next) => {
    const token = extractToken(req);
    if (token) {
        jwt.verify(token, environment_1.default.security.apiSecret, applyBearer(req, next));
    }
    next();
};
function extractToken(req) {
    //Authorization: Bearer TOKEN
    let token = undefined;
    const authorization = req.header("Authorization", "");
    const parts = authorization.split(" ");
    const isTokenBearer = parts.length === 2 && parts[0] === "Bearer";
    if (isTokenBearer) {
        token = parts[1];
    }
    return token;
}
function applyBearer(req, next) {
    return (error, decoded) => {
        if (decoded) {
            user_model_1.default.findByEmail(decoded.sub)
                .then((user) => {
                if (user) {
                    req.authenticated = user;
                }
                next();
            })
                .catch(next);
        }
        next();
    };
}
exports.default = tokenParser;
