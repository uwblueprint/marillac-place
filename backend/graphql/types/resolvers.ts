import { gql } from "apollo-server-express";

const resolverTypes = gql`
  type Query {
    getAllParticipants: [Participant]
    getParticipantById(participantId: String): Participant
    getAvailableRooms: [Int]

    getTaskById(taskId: Int!): Task!
    getTasksByType(type: TaskType!): [Task!]
    getTasksByRecurrenceFrequency(
      recurrencePreference: RecurrenceFrequency!
    ): [Task!]
  }

  type Mutation {
    createParticipant(
      participantId: String
      roomNumber: Int
      arrival: String
      password: String
    ): Boolean

    createTask(
      type: TaskType!
      name: String!
      recurrencePreference: RecurrenceFrequency!
      repeatDays: [DaysOfWeek!]!
      timePreference: TimeOption!
      credit: Int!
      deduction: Int!
      start: String
      end: String
      comment: String
    ): Task!

    updateTask(
      taskId: Int!
      type: TaskType
      name: String
      recurrencePreference: RecurrenceFrequency
      repeatDays: [DaysOfWeek]
      timePreference: TimeOption
      credit: Int
      deduction: Int
      start: String
      end: String
      comment: String
    ): Task!

    deleteTask(taskId: Int!): Task!
  }
`;

export default resolverTypes;
