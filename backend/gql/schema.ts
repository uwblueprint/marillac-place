import { makeExecutableSchema } from "apollo-server-express";
import { applyMiddleware } from "graphql-middleware";
import { merge } from "lodash";

import {
  typeDefs as scalarTypeDefs,
  resolvers as scalarResolvers,
} from "graphql-scalars";

import models from "./types/models";
import enums from "./types/enums";
import resolvers from "./types/resolvers";
import responses from "./types/responses";

import participantResolver from "./resolvers/participantResolver";
import noteResolver from "./resolvers/noteResolver";
import announcementResolver from "./resolvers/announcementResolver";
import loginResolver from "./resolvers/loginResolver";
import taskResolver from "./resolvers/taskResolver";
import customBadgeResolver from "./resolvers/customBadgeResolver";
import assignedTaskResolver from "./resolvers/assignedTaskResolver";
import reportRecipientResolver from "./resolvers/reportRecipientResolver";
import achievedBadgeLevelResolver from "./resolvers/achievedBadgeLevelResolver";
import badgeLevelResolver from "./resolvers/badgeLevelResolver";
import earnedCustomBadgeResolver from "./resolvers/earnedCustomBadgeResolver";
import badgeLevelProgressResolver from "./resolvers/badgeLevelProgressResolver";
import earningGoalResolver from "./resolvers/earningGoalResolver";
import receivedAnnouncementResolver from "./resolvers/receivedAnnouncementResolver";
import systemBadgeResolver from "./resolvers/systemBadgeResolver";
import transactionResolver from "./resolvers/transactionResolver";

import getMiddleware from "./middleware";

export default function getSchema() {
  const middleware = getMiddleware();
  const schema = makeExecutableSchema({
    typeDefs: [...scalarTypeDefs, models, enums, resolvers, responses],
    resolvers: merge(
      scalarResolvers,
      loginResolver,
      noteResolver,
      announcementResolver,
      reportRecipientResolver,
      achievedBadgeLevelResolver,
      badgeLevelResolver,
      earnedCustomBadgeResolver,
      badgeLevelProgressResolver,
      earningGoalResolver,
      receivedAnnouncementResolver,
      systemBadgeResolver,
      transactionResolver,
      participantResolver,
      taskResolver,
      customBadgeResolver,
      assignedTaskResolver
    ),
  });

  const schemaWithMiddleware = applyMiddleware(schema, middleware);
  return schemaWithMiddleware;
}
