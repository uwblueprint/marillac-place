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
  }
`;

export default resolverTypes;
