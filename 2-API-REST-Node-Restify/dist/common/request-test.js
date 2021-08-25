"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
exports.default = (endpoint, method, data = undefined, headers) => {
    const url = `http://localhost:3001${endpoint}`;
    const options = { url, method, data };
    if (headers) {
        options.headers = headers;
    }
    return axios_1.default(options)
        .then((res) => (Object.assign({ status: res.status }, res.data)))
        .catch((err) => ({ status: err.response.status }));
};
