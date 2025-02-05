import { makeExecutableSchema, gql } from "apollo-server-express";
import { applyMiddleware } from "graphql-middleware";
import { merge } from "lodash";
import {
  typeDefs as scalarTypeDefs,
  resolvers as scalarResolvers,
} from "graphql-scalars";

import helloResolver from "./resolvers/helloResolver";

import dataModels from "./types/models";
import customTypes from "./types/enums";
import resolverTypes from "./types/resolvers";

const executableSchema = makeExecutableSchema({
  typeDefs: [
    ...scalarTypeDefs,
    dataModels,
    customTypes,
    resolverTypes,
  ],
  resolvers: merge(
    scalarResolvers,
    helloResolver
  ),
});

// const authorizedByAllUserTypes = () =>
//   isAuthorizedByUserType(new Set([UserType.STAFF, UserType.RESIDENT]));
// const authorizedByStaff = () =>
//   isAuthorizedByUserType(new Set([UserType.STAFF]));

const graphQLMiddlewares = {
  Query: {
    // getNotificationsByUserId: authorizedByAllUserTypes(),
    // getNotificationById: authorizedByAllUserTypes(),
    // getStaffByIds: authorizedByStaff(),
    // getAllStaff: authorizedByStaff(),
    // getResidentsByIds: authorizedByStaff(),
    // getAllResidents: authorizedByStaff(),
    // getActiveResidents: authorizedByStaff(),
    // getTaskById: authorizedByAllUserTypes(),
    // getTasksByType: authorizedByAllUserTypes(),
    // getTasksByAssigneeId: authorizedByAllUserTypes(),
    // getTasksByAssignerId: authorizedByStaff(),
    // getTasksByStartDate: authorizedByAllUserTypes(),
    // getTasksByEndDate: authorizedByAllUserTypes(),
    // getTasksByStatus: authorizedByAllUserTypes(),
  },
  Mutation: {
    // sendNotification: authorizedByAllUserTypes(),
    // deleteUserNotification: authorizedByStaff(),
    // updateSeenNotification: authorizedByAllUserTypes(),
    // sendAnnouncement: authorizedByStaff(),
    // addStaff: authorizedByStaff(),
    // updateStaff: authorizedByStaff(),
    // deleteStaff: authorizedByStaff(),
    // addResident: authorizedByStaff(),
    // updateResident: authorizedByStaff(),
    // deleteResident: authorizedByStaff(),
    // redeemCredits: authorizedByStaff(),
    // createTask: authorizedByAllUserTypes(),
    // updateTask: authorizedByAllUserTypes(),
    // deleteTask: authorizedByAllUserTypes(),
    // assignTask: authorizedByStaff(),
    // changeTaskStatus: authorizedByStaff(),
  },
};

export default applyMiddleware(executableSchema, graphQLMiddlewares);
