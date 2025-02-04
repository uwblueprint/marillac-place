import { gql } from "apollo-server-express";

const resolverTypes = gql`
  type Query {
    hello(name: String): String!
  }

  type Mutation {
    _empty: String
  }
`;

export default resolverTypes;
