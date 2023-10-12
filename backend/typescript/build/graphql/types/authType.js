"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const authType = apollo_server_express_1.gql `
  type AuthDTO {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    role: Role!
    accessToken: String!
  }

  input RegisterUserDTO {
    firstName: String!
    lastName: String!
    email: String!
    password: String!
  }

  extend type Mutation {
    login(email: String!, password: String!): AuthDTO!
    loginWithGoogle(idToken: String!): AuthDTO!
    register(user: RegisterUserDTO!): AuthDTO!
    refresh: String!
    logout(userId: ID!): ID
    resetPassword(email: String!): Boolean!
  }
`;
exports.default = authType;
