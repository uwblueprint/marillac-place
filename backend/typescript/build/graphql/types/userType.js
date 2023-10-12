"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const userType = apollo_server_express_1.gql `
  enum Role {
    User
    Admin
  }

  type UserDTO {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    role: Role!
  }

  input CreateUserDTO {
    firstName: String!
    lastName: String!
    email: String!
    role: Role!
    password: String!
  }

  input UpdateUserDTO {
    firstName: String!
    lastName: String!
    email: String!
    role: Role!
  }

  extend type Query {
    userById(id: ID!): UserDTO!
    userByEmail(email: String!): UserDTO!
    users: [UserDTO!]!
    usersCSV: String!
  }

  extend type Mutation {
    createUser(user: CreateUserDTO!): UserDTO!
    updateUser(id: ID!, user: UpdateUserDTO!): UserDTO!
    deleteUserById(id: ID!): ID
    deleteUserByEmail(email: String!): ID
  }
`;
exports.default = userType;
