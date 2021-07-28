"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const environment = {
    server: { port: process.env.SERVER_PORT || 3000 },
    db: { url: process.env.DB_URL || "mongodb://localhost:27017/meat-api" },
};
exports.default = environment;
