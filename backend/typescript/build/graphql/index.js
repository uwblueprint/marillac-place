"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const graphql_middleware_1 = require("graphql-middleware");
const lodash_1 = require("lodash");
const auth_1 = require("../middlewares/auth");
const authResolvers_1 = __importDefault(require("./resolvers/authResolvers"));
const authType_1 = __importDefault(require("./types/authType"));
const entityResolvers_1 = __importDefault(require("./resolvers/entityResolvers"));
const entityType_1 = __importDefault(require("./types/entityType"));
const simpleEntityResolvers_1 = __importDefault(require("./resolvers/simpleEntityResolvers"));
const simpleEntityType_1 = __importDefault(require("./types/simpleEntityType"));
const userResolvers_1 = __importDefault(require("./resolvers/userResolvers"));
const userType_1 = __importDefault(require("./types/userType"));
const query = apollo_server_express_1.gql `
  type Query {
    _empty: String
  }
`;
const mutation = apollo_server_express_1.gql `
  type Mutation {
    _empty: String
  }
`;
const executableSchema = apollo_server_express_1.makeExecutableSchema({
    typeDefs: [query, mutation, authType_1.default, entityType_1.default, simpleEntityType_1.default, userType_1.default],
    resolvers: lodash_1.merge(authResolvers_1.default, entityResolvers_1.default, simpleEntityResolvers_1.default, userResolvers_1.default),
});
const authorizedByAllRoles = () => auth_1.isAuthorizedByRole(new Set(["User", "Admin"]));
const authorizedByAdmin = () => auth_1.isAuthorizedByRole(new Set(["Admin"]));
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
        logout: auth_1.isAuthorizedByUserId("userId"),
        resetPassword: auth_1.isAuthorizedByEmail("email"),
    },
};
exports.default = graphql_middleware_1.applyMiddleware(executableSchema, graphQLMiddlewares);
