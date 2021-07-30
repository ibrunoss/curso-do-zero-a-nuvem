"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleError = (req, res, err, done) => {
    const error = {};
    const transformErr = () => {
        err.toJSON = () => ({ message: err.message });
        err.toString = () => err.message;
    };
    switch (err.name) {
        case "MongoError":
            transformErr();
            if (err.code === 11000) {
                err.statusCode = 400;
            }
            break;
        case "ValidationError":
            const messages = [];
            for (let name in err.errors) {
                messages.push({ message: err.errors[name].message });
            }
            error.toJSON = () => ({ message: err.message, errors: messages });
            res.json(400, error);
            break;
        default:
            transformErr();
    }
    return done();
};
exports.default = handleError;
