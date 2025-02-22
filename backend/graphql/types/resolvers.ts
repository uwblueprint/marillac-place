import { gql } from "apollo-server-express";

const resolverTypes = gql`
  type Query {
    getAllParticipants: [Participant]
    getParticipantById(participantId: String): Participant
    getAvailableRooms: [Int]

    getTaskById: Task
    getTasksByType: [Task]
    getTasksByStartDate: [Task]
  }

  type Mutation {
    createParticipant(
      participantId: String
      roomNumber: Int
      arrival: String
      password: String
    ): Boolean

    createTask(task: InputTaskDTO): Task
  }
`;

export default resolverTypes;
