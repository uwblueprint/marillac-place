import { gql } from "apollo-server-express";

const resolverTypes = gql`
  type Query {
    getPastParticipants: [Participant]
    getCurrentParticipants: [Participant]
    getParticipantById(participantId: String!): Participant
    getNotes: [Note]
  }

  type Mutation {
    login(role: String!, encryptedPassword: String!): AuthResponse
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
    createNote(message: String!, date: String!, formattedDate: String!): Boolean
    deleteNote(noteId: Int!): Boolean
  }
`;

export default resolverTypes;
