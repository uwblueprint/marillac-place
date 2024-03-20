import { makeExecutableSchema, gql } from "apollo-server-express";
import { applyMiddleware } from "graphql-middleware";
import { merge } from "lodash";
import {
  typeDefs as scalarTypeDefs,
  resolvers as scalarResolvers,
} from "graphql-scalars";
import { UserType } from "@prisma/client";

import {
  isAuthorizedByEmail,
  isAuthorizedByUserType,
  isAuthorizedByUserId,
} from "../middlewares/auth";
import authResolvers from "./resolvers/authResolvers";
import authType from "./types/authType";
import notificationResolvers from "./resolvers/notificationResolvers";
import notificationType from "./types/notificationType";
import staffResolvers from "./resolvers/staffResolver";
import staffType from "./types/staffType";
import residentResolvers from "./resolvers/residentResolvers";
import residentType from "./types/residentType";
import taskResolvers from "./resolvers/taskResolvers";
import taskType from "./types/taskType";

const query = gql`
  type Query {
    _empty: String
  }
`;

const mutation = gql`
  type Mutation {
    _empty: String
  }
`;

const executableSchema = makeExecutableSchema({
  typeDefs: [
    ...scalarTypeDefs,
    query,
    mutation,
    authType,
    notificationType,
    staffType,
    residentType,
    taskType,
  ],
  resolvers: merge(
    scalarResolvers,
    authResolvers,
    notificationResolvers,
    staffResolvers,
    residentResolvers,
    taskResolvers,
  ),
});

const authorizedByAllUserTypes = () =>
  isAuthorizedByUserType(new Set([UserType.STAFF, UserType.RESIDENT]));
const authorizedByStaff = () =>
  isAuthorizedByUserType(new Set([UserType.STAFF]));

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
    // login: isAuthorizedByEmail("email"),
    // refresh: isAuthorizedByEmail("email"),
    // logout: isAuthorizedByUserId("userId"),
    // resetPassword: isAuthorizedByEmail("email"),
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
