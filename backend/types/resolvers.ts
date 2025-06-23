import { gql } from "apollo-server-express";

const resolvers = gql`
  type Query {
    getPastParticipants: [Participant]
    getCurrentParticipants: [Participant]
    getParticipantByRoom(room_number: Int!): Participant
    getParticipantsByRooms(room_numbers: [Int!]!): [Participant]
    getNotes: [Note]
    getAllAnnouncements: [Announcement]
    getAnnouncementsInDateRange(start: String!, end: String!): [Announcement]
    getAnnouncementsByParticipants(participant_ids: [Int!]!): [Announcement]
    getTasksByType(type: TaskType!): [Task]
  }

  type Mutation {
    adminLogin(role: String!, password: String!): LoginResponse
    participantLogin(id: Int!, password: String!): LoginResponse
    createBadge( 
      name: String!, 
      description: String!,
      icon: Icon!
    ): Boolean 
    createParticipant(
      participant_id: Int!
      room_number: Int!
      arrival_date: String!
      password: String!
    ): Boolean
    updateParticipant(
      participant_id: Int!
      room_number: Int
      arrival_date: String
      password: String
      departure_date: String
      account_creation_date: String
      account_removal_date: String
      marillac_bucks: Int
      marillac_bucks_goal: Int
    ): Boolean
    updateMarillacBucks(
      participant_id: Int!
      marillac_bucks: Int!
      reason: String!
    ): Boolean
    createNote(message: String!, creation_date: String!): Boolean
    deleteNote(note_id: Int!): Boolean
    createAnnouncement(
      priority: Priority!
      participants: [Int!]!
      message: String!
    ): Boolean
    editAnnouncement(
      announcement_id: Int!
      priority: Priority
      message: String
    ): Boolean
    deleteAnnouncement(announcement_id: Int!): Boolean
    createTask(
      type: TaskType!
      name: String!
      recurrencePreference: RecurrenceFrequency!
      repeatDays: [DayOfWeek!]!
      timePreference: TimeOption!
      marillacBucks: Int!
      deduction: Int!
      startTime: String
      endTime: String
      comment: String
    ): Boolean
    updateTask(
      id: Int!
      type: TaskType
      name: String
      recurrencePreference: RecurrenceFrequency
      repeatDays: [DayOfWeek!]
      timePreference: TimeOption
      marillacBucks: Int
      deduction: Int
      startTime: String
      endTime: String
      comment: String
    ): Boolean
    deleteTaskById(taskId: Int!): Boolean
    assignCustomBadge(badge_id: Int!, participant_id: Int!): EarnedBadge
    editCustomBadge(
      custom_badge_id: Int!
      new_custom_badge_name: String
      new_custom_badge_description: String
    ): Boolean
  }
`;

export default resolvers;
