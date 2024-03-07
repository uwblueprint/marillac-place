import { gql } from "apollo-server-express";

const userType = gql`
  enum UserTypes {
    STAFF
    RESIDENT
  }

  type UserDTO {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    role: Role!
  }

  input CreateUserDTO {
    email: String!
    password: String!
    phoneNumber: String
    firstName: String!
    lastName: String!
    displayName: String
    profilePictureLink: String
  }

  input UpdateUserDTO {
    email: String
    password: String
    phoneNumber: String
    firstName: String
    lastName: String
    displayName: String
    profilePictureLink: String
    isActive: Boolean
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

export default userType;
