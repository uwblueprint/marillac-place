import express from "express";
import path from "path";
import { ApolloServer } from "apollo-server-express";
import getSchema from "./gql/schema";

require("./crons/index");

const app = express();

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

const schema = getSchema();
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
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
});

const frontendPath = path.join(__dirname, "../frontend/build");
app.use(express.static(frontendPath));

app.get("*", (req, res) => {
  if (req.path.startsWith("/graphql") || req.path.startsWith("/health")) {
    return res.status(404).json({ error: "Not Found" });
  }
  return res.sendFile(path.join(frontendPath, "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen({ port: PORT }, () => {
  console.info(`Server is listening on port ${PORT}!`);
  console.info(`CORS enabled for origin: ${process.env.FRONTEND_URL}`);
});
