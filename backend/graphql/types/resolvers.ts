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
  }
`;

export default resolverTypes;
