import { gql } from "apollo-server-express";

const resolvers = gql`
  type Query {
    _temporary: String
  }

  type Mutation {
    adminLogin(role: String!, password: String!): LoginResponse
    participantLogin(id: Int!, password: String!): LoginResponse
  }
`;

export default resolvers;
