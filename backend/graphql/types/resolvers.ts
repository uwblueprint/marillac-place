import { gql } from "apollo-server-express";

const resolverTypes = gql`
  type Query {
    getPastParticipants: [Participant]
    getParticipantById(participantId: String!): Participant
    getAvailableRooms: [Int]
  }

  type Mutation {
    createParticipant(
      participantId: String!
      roomNumber: Int!
      arrival: String!
      password: String!
    ): Boolean
    updateParticipantById(
      participantId: String!
      roomNumber: Int
      arrival: String
      departure: String
      password: String
    ): Boolean
  }
`;

export default resolverTypes;
