import { gql } from "apollo-server-express";

const responses = gql`
  type LoginResponse {
    token: String!
  }
`;

export default responses;