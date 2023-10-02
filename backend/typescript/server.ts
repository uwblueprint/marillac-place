import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import * as firebaseAdmin from "firebase-admin";

import { ApolloServer } from "apollo-server-express";
import { sequelize } from "./models";
import schema from "./graphql";

const CORS_ALLOW_LIST = [
  "http://localhost:3000",
  "https://uw-blueprint-starter-code.firebaseapp.com",
  "https://uw-blueprint-starter-code.web.app",
  /^https:\/\/uw-blueprint-starter-code--pr.*\.web\.app$/,
];

const CORS_OPTIONS: cors.CorsOptions = {
  origin: CORS_ALLOW_LIST,
  credentials: true,
};


const app = express();
app.use(cookieParser());
app.use(cors(CORS_OPTIONS));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = new ApolloServer({
  schema,
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

sequelize.authenticate();

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_SVC_ACCOUNT_PRIVATE_KEY?.replace(
      /\\n/g,
      "\n",
    ),
    clientEmail: process.env.FIREBASE_SVC_ACCOUNT_CLIENT_EMAIL,
  }),
});

app.listen({ port: process.env.PORT || 5000 }, () => {
  /* eslint-disable-next-line no-console */
  console.info(`Server is listening on port ${process.env.PORT || 5000}!`);
});
