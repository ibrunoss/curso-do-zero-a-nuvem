"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jsonwebtoken");
const user_model_1 = require("../users/user.model");
const environment_1 = require("../common/environment");
const tokenParser = (req, res, next) => {
    const token = extractToken(req);
    if (token) {
        return jwt.verify(token, environment_1.default.security.apiSecret, applyBearer(req, next));
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
    return (error, decoded) => __awaiter(this, void 0, void 0, function* () {
        if (decoded) {
            yield user_model_1.default.findByEmail(decoded.sub)
                .then((user) => {
                if (user) {
                    req.authenticated = user;
                }
            })
                .catch(next);
        }
        next();
    });
}
exports.default = tokenParser;
