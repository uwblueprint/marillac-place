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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const firebaseAdmin = __importStar(require("firebase-admin"));
const apollo_server_express_1 = require("apollo-server-express");
const models_1 = require("./models");
const graphql_1 = __importDefault(require("./graphql"));
const CORS_ALLOW_LIST = [
    "http://localhost:3000",
    "https://uw-blueprint-starter-code.firebaseapp.com",
    "https://uw-blueprint-starter-code.web.app",
    /^https:\/\/uw-blueprint-starter-code--pr.*\.web\.app$/,
];
const CORS_OPTIONS = {
    origin: CORS_ALLOW_LIST,
    credentials: true,
};
const app = express_1.default();
app.use(cookie_parser_1.default());
app.use(cors_1.default(CORS_OPTIONS));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
const server = new apollo_server_express_1.ApolloServer({
    schema: graphql_1.default,
    context: ({ req, res }) => ({ req, res }),
    playground: {
        settings: {
            "request.credentials": "include",
        },
    },
});
server.applyMiddleware({
    app,
    path: "/graphql",
    cors: { origin: CORS_ALLOW_LIST, credentials: true },
});
models_1.sequelize.authenticate();
firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_SVC_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        clientEmail: process.env.FIREBASE_SVC_ACCOUNT_CLIENT_EMAIL,
    }),
});
app.listen({ port: process.env.PORT || 5000 }, () => {
    /* eslint-disable-next-line no-console */
    console.info(`Server is listening on port ${process.env.PORT || 5000}!`);
});
