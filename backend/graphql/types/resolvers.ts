import { gql } from "apollo-server-express";

const resolverTypes = gql`
  type Query {
    getAllParticipants: [Participant]
    getParticipantById(participantId: String): Participant
    getAvailableRooms: [Int]

    getTaskById(taskId: Int!): Task!
    getTasksByType(type: TaskType!): [Task!]
    getTasksByStartDate(startDate: DateTime!): [Task!]
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
      credit: Int!
      start: DateTime!
      end: DateTime
      isRecurring: Boolean!
      repeatDays: [DaysOfWeek!]
    ): Task!

    updateTask(
      taskId: Int!
      type: TaskType
      name: String
      credit: Int
      start: DateTime
      end: DateTime
      isRecurring: Boolean
      repeatDays: [DaysOfWeek]
    ): Task!

    deleteTask(taskId: Int!): Task!
  }
`;

export default resolverTypes;
