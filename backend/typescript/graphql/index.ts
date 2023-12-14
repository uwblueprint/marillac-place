import { makeExecutableSchema, gql } from "apollo-server-express";
import { applyMiddleware } from "graphql-middleware";
import { merge } from "lodash";
import {
  typeDefs as scalarTypeDefs,
  resolvers as scalarResolvers,
} from "graphql-scalars";

import {
  isAuthorizedByEmail,
  isAuthorizedByRole,
  isAuthorizedByUserId,
} from "../middlewares/auth";
import authResolvers from "./resolvers/authResolvers";
import authType from "./types/authType";
import entityResolvers from "./resolvers/entityResolvers";
import entityType from "./types/entityType";
import simpleEntityResolvers from "./resolvers/simpleEntityResolvers";
import adminResolvers from "./resolvers/notificationResolvers";
import simpleEntityType from "./types/simpleEntityType";
import userResolvers from "./resolvers/userResolvers";
import userType from "./types/userType";
import staffType from "./types/staffType";
import staffResolver from "./resolvers/staffResolver";
import adminType from "./types/notificationType";
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
    entityType,
    residentType,
    simpleEntityType,
    userType,
    taskType,
    staffType,
    adminType,
  ],
  resolvers: merge(
    scalarResolvers,
    authResolvers,
    entityResolvers,
    residentResolvers,
    simpleEntityResolvers,
    userResolvers,
    taskResolvers,
    staffResolver,
    adminResolvers,
  ),
});

const authorizedByAllRoles = () =>
  isAuthorizedByRole(new Set(["User", "Admin"]));
const authorizedByAdmin = () => isAuthorizedByRole(new Set(["Admin"]));

const graphQLMiddlewares = {
  Query: {
    entity: authorizedByAllRoles(),
    entities: authorizedByAllRoles(),
    simpleEntity: authorizedByAllRoles(),
    simpleEntities: authorizedByAllRoles(),
    userById: authorizedByAdmin(),
    userByEmail: authorizedByAdmin(),
    users: authorizedByAdmin(),
  },
  Mutation: {
    createEntity: authorizedByAllRoles(),
    updateEntity: authorizedByAllRoles(),
    deleteEntity: authorizedByAllRoles(),
    createSimpleEntity: authorizedByAllRoles(),
    updateSimpleEntity: authorizedByAllRoles(),
    deleteSimpleEntity: authorizedByAllRoles(),
    createUser: authorizedByAdmin(),
    updateUser: authorizedByAdmin(),
    deleteUserById: authorizedByAdmin(),
    deleteUserByEmail: authorizedByAdmin(),
    logout: isAuthorizedByUserId("userId"),
    resetPassword: isAuthorizedByEmail("email"),
  },
};

export default applyMiddleware(executableSchema, graphQLMiddlewares);
