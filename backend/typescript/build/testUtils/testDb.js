"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testSql = void 0;
const path_1 = require("path");
const sequelize_typescript_1 = require("sequelize-typescript");
const DATABASE_URL = process.env.NODE_ENV === "production"
    ? /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
        process.env.DATABASE_URL
    : `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.DB_HOST}:5432/${process.env.POSTGRES_DB_TEST}`;
/* eslint-disable-next-line import/prefer-default-export */
exports.testSql = new sequelize_typescript_1.Sequelize(DATABASE_URL, {
    models: [path_1.resolve(__dirname, "../models/*.model.ts")],
    logging: false,
});
