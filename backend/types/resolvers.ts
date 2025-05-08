import { gql } from "apollo-server-express";

const resolvers = gql`
  type Query {
    getPastParticipants: [Participant]
    getCurrentParticipants: [Participant]
    getNotes: [Note]
  }

  type Mutation {
    adminLogin(role: String!, password: String!): LoginResponse
    participantLogin(id: Int!, password: String!): LoginResponse
    createParticipant(
      participant_id: Int!, 
      room_number: Int!, 
      arrival_date: String!,
      password: String!
    ): Boolean
    updateParticipant(
      participant_id: Int!,
      room_number: Int,
      arrival_date: String,
      password: String,
      departure_date: String,
      account_creation_date: String,
      account_removal_date: String,
      marillac_bucks: Int,
      marillac_bucks_goal: Int,
    ): Boolean
    createNote(
      message: String!,
      creation_date: String!
    ): Boolean
    deleteNote(note_id: Int!): Boolean
  }
`;

export default resolvers;
