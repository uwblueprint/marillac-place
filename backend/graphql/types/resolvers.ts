import { gql } from "apollo-server-express";

const resolverTypes = gql`
  type Query {
    getPastParticipants: [Participant]
    getCurrentParticipants: [Participant]
    getParticipantById(participantId: String!): Participant
    getNotes: [Note]
    getAllAnnouncements: [Announcement]
    getAnnouncementByRooms(rooms: [Int]): [Announcement]
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
    createAnnouncement(
      announcementId: Int
      from: StaffType
      to: [Int]
      priority: PriorityType
      createdAt: String
      message: String
    ): Boolean
    editAnnouncement(
      announcementId: Int
      from: StaffType
      to: [Int]
      priority: PriorityType
      createdAt: String
      message: String
    ): Boolean
    deleteAnnouncement(announcementId: Int): Boolean
    createNote(message: String!, date: String!, formattedDate: String!): Boolean
    deleteNote(noteId: Int!): Boolean
  }
`;

export default resolverTypes;
