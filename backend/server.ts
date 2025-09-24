import express from "express";
import { ApolloServer } from "apollo-server-express";
import getGraphQLSchema from "./utils/getGraphQLSchema";
require("./crons/index");

const app = express();

const schema = getGraphQLSchema();

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
  cors: {
    origin: process.env.FRONTEND_URL || "",
    credentials: true,
  },
});

const PORT = process.env.PORT || 5001;
app.listen({ port: PORT }, () => {
  console.info(`Server is listening on port ${PORT}!`);
});

