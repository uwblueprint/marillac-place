import { makeExecutableSchema } from "apollo-server-express";
import { merge } from "lodash";
// import { applyMiddleware } from "graphql-middleware";

import {
  typeDefs as scalarTypeDefs,
  resolvers as scalarResolvers,
} from "graphql-scalars";

import dataModels from "./types/models";
import customTypes from "./types/enums";
import resolverTypes from "./types/resolvers";

import participantResolvers from "./resolvers/participantResolver";
import noteResolvers from "./resolvers/noteResolver";
import announcementResolvers from "./resolvers/announcementResolver";
import authResolver from "./resolvers/auth";

const schema = makeExecutableSchema({
  typeDefs: [...scalarTypeDefs, dataModels, customTypes, resolverTypes],
  resolvers: merge(
    scalarResolvers,

    participantResolvers,
    announcementResolvers,

    noteResolvers,
    authResolver,
  ),
});

export default schema;

// const authorizedByAllUserTypes = () =>
//   isAuthorizedByUserType(new Set([UserType.STAFF, UserType.RESIDENT]));
// const authorizedByStaff = () =>
//   isAuthorizedByUserType(new Set([UserType.STAFF]));

// const graphQLMiddlewares = {
//   Query: {
//     // getNotificationsByUserId: authorizedByAllUserTypes(),
//     // getNotificationById: authorizedByAllUserTypes(),
//     // getStaffByIds: authorizedByStaff(),
//     // getAllStaff: authorizedByStaff(),
//     // getResidentsByIds: authorizedByStaff(),
//     // getAllResidents: authorizedByStaff(),
//     // getActiveResidents: authorizedByStaff(),
//     // getTaskById: authorizedByAllUserTypes(),
//     // getTasksByType: authorizedByAllUserTypes(),
//     // getTasksByAssigneeId: authorizedByAllUserTypes(),
//     // getTasksByAssignerId: authorizedByStaff(),
//     // getTasksByStartDate: authorizedByAllUserTypes(),
//     // getTasksByEndDate: authorizedByAllUserTypes(),
//     // getTasksByStatus: authorizedByAllUserTypes(),
//   },
//   Mutation: {
//     // sendNotification: authorizedByAllUserTypes(),
//     // deleteUserNotification: authorizedByStaff(),
//     // updateSeenNotification: authorizedByAllUserTypes(),
//     // sendAnnouncement: authorizedByStaff(),
//     // addStaff: authorizedByStaff(),
//     // updateStaff: authorizedByStaff(),
//     // deleteStaff: authorizedByStaff(),
//     // addResident: authorizedByStaff(),
//     // updateResident: authorizedByStaff(),
//     // deleteResident: authorizedByStaff(),
//     // redeemCredits: authorizedByStaff(),
//     // createTask: authorizedByAllUserTypes(),
//     // updateTask: authorizedByAllUserTypes(),
//     // deleteTask: authorizedByAllUserTypes(),
//     // assignTask: authorizedByStaff(),
//     // changeTaskStatus: authorizedByStaff(),
//   },
// };

// export default applyMiddleware(executableSchema, graphQLMiddlewares);
