"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    service: "gmail",
    auth: {
        type: "OAuth2",
        user: process.env.MAILER_USER ?? "",
        clientId: process.env.MAILER_CLIENT_ID ?? "",
        clientSecret: process.env.MAILER_CLIENT_SECRET ?? "",
        refreshToken: process.env.MAILER_REFRESH_TOKEN ?? "",
    },
};
exports.default = config;
