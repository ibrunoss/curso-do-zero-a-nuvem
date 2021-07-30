"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleError = (req, res, err, done) => {
    err.toJSON = () => ({ message: err.message });
    err.toString = () => err.message;
    switch (err.name) {
        case "MongoError":
            if (err.code === 11000) {
                err.statusCode = 400;
            }
            break;
        case "ValidationError":
            err.statusCode = 400;
            break;
    }
    return done();
};
exports.default = handleError;
