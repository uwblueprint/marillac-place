"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.migrator = void 0;
const path = __importStar(require("path"));
const umzug_1 = require("umzug");
const sequelize_typescript_1 = require("sequelize-typescript");
const DATABASE_URL = process.env.NODE_ENV === "production"
    ? /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
        process.env.DATABASE_URL
    : `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.DB_HOST}:5432/${process.env.POSTGRES_DB_DEV}`;
const sequelize = new sequelize_typescript_1.Sequelize(DATABASE_URL, {
    models: [path.join(__dirname, "/*.model.ts")],
});
exports.migrator = new umzug_1.Umzug({
    migrations: {
        glob: ["migrations/*.ts", { cwd: __dirname }],
    },
    context: sequelize,
    storage: new umzug_1.SequelizeStorage({
        sequelize,
    }),
    logger: console,
});
