"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const environment = {
    server: { port: process.env.SERVER_PORT || 3000 },
    db: { url: process.env.DB_URL || "mongodb://localhost:27017/meat-api" },
    security: {
        salt: process.env.SALT_ROUNDS || 10,
        apiSecret: process.env.API_SECRET || "meat-api-secret",
        enableHTTPS: !!parseInt(process.env.ENABLE_HTTPS) || true,
        certificate: process.env.CERT_FILE || "./security/keys/cert.pem",
        key: process.env.CERT_KEY || "./security/keys/key.pem",
    },
    log: {
        name: "meat-api",
        level: process.env.LOG_LEVEL || "debug",
    },
};
exports.default = environment;
