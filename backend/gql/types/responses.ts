import { gql } from "apollo-server-express";

const responses = gql`
  type LoginResponse {
    token: String!
  }

  type GetWeeklyEarningsResponse {
    SUNDAY: Int!
    MONDAY: Int!
    TUESDAY: Int!
    WEDNESDAY: Int!
    THURSDAY: Int!
    FRIDAY: Int!
    SATURDAY: Int!
  }
`;

export default responses;
