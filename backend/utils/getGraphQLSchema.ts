import { makeExecutableSchema } from "apollo-server-express";
import { applyMiddleware } from "graphql-middleware";
import { merge } from "lodash";

import {
  typeDefs as scalarTypeDefs,
  resolvers as scalarResolvers,
} from "graphql-scalars";

import models from "../types/models";
import enums from "../types/enums";
import resolvers from "../types/resolvers";
import responses from "../types/responses";

import participantResolver from "../resolvers/participantResolver";
import noteResolver from "../resolvers/noteResolver";
// import announcementResolvers from "./resolvers/announcementResolver";
import loginResolver from "../resolvers/loginResolver";
// import taskResolvers from "./resolvers/taskResolver";

import getGraphQLMiddleware from "./getGraphQLMiddleware";

export default function getGraphQLSchema() {
  const middleware = getGraphQLMiddleware();
  const schema = makeExecutableSchema({
    typeDefs: [...scalarTypeDefs, models, enums, resolvers, responses],
    resolvers: merge(
      scalarResolvers,
      loginResolver,
      noteResolver,
      participantResolver
    ),
  });

  const schemaWithMiddleware = applyMiddleware(schema, middleware);
  return schemaWithMiddleware;
};



