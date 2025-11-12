import { gql } from "apollo-server-express";

const responses = gql`
  type AdminLoginResponse {
    token: String!
  }

  type ParticipantLoginResponse {
    token: String!
    participant: Participant!
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
