import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import * as firebaseAdmin from "firebase-admin";

import { ApolloServer, gql } from "apollo-server-express"; // Import gql from apollo-server-express
import { sequelize } from "./models";
import { PrismaClient } from "@prisma/client"
import schema from "./graphql";

const prisma = new PrismaClient();
const { staff } = prisma;

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


// Define your GraphQL schema
const typeDefs = gql`
  type Query {
    hello: String
    getData: String
  }

  type Profile {
    role_id: Int,
    first_name: String,
    last_name: String,
    email: String,
  }

  type Mutation {
    addProfile(input: StaffInput!): Profile
  }
  
  input StaffInput {
    role_id: Int
    first_name: String
    last_name: String
    email: String!

  }
`;

const resolvers = {
  Query: {
    hello: () => 'testing',
    getData: async () => {
      const data = await prisma.staff.count();
      await prisma.$disconnect();
      return data;
    }
  },
  Mutation: {
    addProfile: async (parent: any, args: any) => {
      const { data } = args;
      try {
        const newProfile = await prisma.profile.create({
          data: data,
        });
        return newProfile;
      } catch (error: any) {
        throw new Error(`failed to create new profile: ${error.message}`)
      }
    }
  },

};

const server = new ApolloServer({
  typeDefs, // Use your GraphQL schema
  resolvers,
  context: ({ req, res }) => ({ req, res, prisma }),
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
  console.info(`Server is listening on port ${process.env.PORT || 5000}!`);
});
