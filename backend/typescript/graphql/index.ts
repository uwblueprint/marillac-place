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
  isAuthorizedByRole,
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

// const authorizedByAllRoles = () =>
//   isAuthorizedByRole(new Set([UserType.STAFF, UserType.RESIDENT]));
// const authorizedByAdmin = () => isAuthorizedByRole(new Set([UserType.STAFF]));

const graphQLMiddlewares = {
  Query: {
    entity: authorizedByAllRoles(),
    entities: authorizedByAllRoles(),
    simpleEntity: authorizedByAllRoles(),
    simpleEntities: authorizedByAllRoles(),
    allResidents: authorizedByAllRoles(),
    userById: authorizedByAdmin(),
    userByEmail: authorizedByAdmin(),
    users: authorizedByAdmin(),
  },
  Mutation: {
    // createEntity: authorizedByAllRoles(),
    // updateEntity: authorizedByAllRoles(),
    // deleteEntity: authorizedByAllRoles(),
    // createSimpleEntity: authorizedByAllRoles(),
    // updateSimpleEntity: authorizedByAllRoles(),
    // deleteSimpleEntity: authorizedByAllRoles(),
    // createUser: authorizedByAdmin(),
    // updateUser: authorizedByAdmin(),
    // deleteUserById: authorizedByAdmin(),
    // deleteUserByEmail: authorizedByAdmin(),
    // logout: isAuthorizedByUserId("userId"),
    // resetPassword: isAuthorizedByEmail("email"),
  },
};

export default applyMiddleware(executableSchema, graphQLMiddlewares);
