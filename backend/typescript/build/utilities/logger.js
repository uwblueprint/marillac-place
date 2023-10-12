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
const winston = __importStar(require("winston"));
const WinstonLogger = winston.createLogger({
    level: "info",
    format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    transports: [
        new winston.transports.File({ filename: "error.log", level: "error" }),
        new winston.transports.File({ filename: "combined.log" }),
    ],
});
if (process.env.NODE_ENV !== "production") {
    WinstonLogger.add(new winston.transports.Console());
}
const logger = (fileName) => {
    return {
        error: (message) => {
            WinstonLogger.error(`[${fileName}] ${message}`);
        },
        warn: (message) => {
            WinstonLogger.warn(`[${fileName}] ${message}`);
        },
        info: (message) => {
            WinstonLogger.info(`[${fileName}] ${message}`);
        },
        http: (message) => {
            WinstonLogger.http(`[${fileName}] ${message}`);
        },
        verbose: (message) => {
            WinstonLogger.verbose(`[${fileName}] ${message}`);
        },
        debug: (message) => {
            WinstonLogger.debug(`[${fileName}] ${message}`);
        },
    };
};
exports.default = logger;
