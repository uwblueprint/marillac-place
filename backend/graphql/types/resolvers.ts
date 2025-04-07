import { gql } from "apollo-server-express";

const resolverTypes = gql`
  type Query {
    getAllParticipants: [Participant]
    getParticipantById(participantId: String): Participant
    getAvailableRooms: [Int]
  }

  type Mutation {
    createParticipant(
      participantId: String
      roomNumber: Int
      arrival: String
      password: String
    ): Boolean

     createTask(
      roomNumber: Int
      type: TaskType
      status: TaskStatus
      name: String!
      isRecurring: Boolean!
      start: DateTime!
      end: DateTime!
      credit: Int!
      comment: String
    ): Task

    createAssignedTask(
      assignedTaskId: Int
      userID: Int
      type: TaskType!
      name: String!
      recurrencePreference: RecurrenceFrequency
      repeatDays: [String]
      timePreference: TimeOption!
      start: String
      end: String
      credit: Int!
      deduction: Int
      comment: String
    ): AssignedTask
  }
`;

export default resolverTypes;
