import express from "express";
import path from "path";
import { ApolloServer } from "apollo-server-express";
import getGraphQLSchema from "./utils/getGraphQLSchema";

require("./crons/index");

const app = express();

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// GraphQL
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

// Helper function to ensure URL has protocol
const getFrontendOrigin = () => {
  const url = process.env.FRONTEND_URL || "";
  if (!url) {
    console.warn("⚠️  WARNING: FRONTEND_URL environment variable is not set. CORS may not work correctly!");
    return "";
  }

  // If URL already has protocol, return as-is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // Otherwise, add https:// (production default)
  return `https://${url}`;
};

server.applyMiddleware({
  app,
  path: "/graphql",
  cors: {
    origin: getFrontendOrigin(),
    credentials: true,
  },
});

// 👉 Serve frontend build (adjust "build" if your React output dir is "dist")
const frontendPath = path.join(__dirname, "../frontend/build");
app.use(express.static(frontendPath));

// 👉 Catch-all: send index.html for non-API routes
app.get("*", (req, res) => {
  // Don’t intercept API routes
  if (req.path.startsWith("/graphql") || req.path.startsWith("/health")) {
    return res.status(404).json({ error: "Not found" });
  }

  res.sendFile(path.join(frontendPath, "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen({ port: PORT }, () => {
  console.info(`Server is listening on port ${PORT}!`);
  console.info(`CORS enabled for origin: ${getFrontendOrigin() || 'NOT SET'}`);
});
