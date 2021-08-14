"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
exports.default = (endpoint, method, data = undefined) => {
    const url = `http://localhost:3001${endpoint}`;
    return axios_1.default({ url, method, data })
        .then((res) => (Object.assign({ status: res.status }, res.data)))
        .catch((err) => ({ status: err.response.status }));
};
