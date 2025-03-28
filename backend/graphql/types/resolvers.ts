import { gql } from "apollo-server-express";

const resolverTypes = gql`
  type Query {
    getAllParticipants: [Participant]
    getParticipantById(participantId: String): Participant
    getAvailableRooms: [Int]
    getAllAnnouncements: [Announcement]
    getAnnouncementByRooms(rooms: [Int]): [Announcement]
  }

  type Mutation {
    createParticipant(
      participantId: String
      roomNumber: Int
      arrival: String
      password: String
    ): Boolean
  }
`;

export default resolverTypes;
