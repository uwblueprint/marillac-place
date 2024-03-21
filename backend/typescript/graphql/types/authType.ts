import { gql } from "apollo-server-express";

const authType = gql`
  enum UserType {
    STAFF
    RESIDENT
  }

  type AuthDTO {
    id: ID!
    type: UserType!
    email: String!
    firstName: String!
    lastName: String!
    accessToken: String!
  }

  extend type Mutation {
    login(email: String!, password: String!, userType: UserType!): AuthDTO!
    refresh: String!
    logout(userId: ID!): ID
    resetPassword(email: String!): Boolean!
  }
`;

export default authType;
