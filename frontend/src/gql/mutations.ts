import { gql } from "@apollo/client";

export const CREATE_PARTICIPANT = gql`
  mutation createParticipant(
    $participantId: String
    $roomNumber: Int
    $arrival: String
    $password: String
  ) {
    createParticipant(
      participantId: $participantId
      roomNumber: $roomNumber
      arrival: $arrival
      password: $password
    )
  }
`;

export const CREATE_TASK = gql`
  mutation createTask(
    $roomNumber: Int
    $type: TaskType!
    $status: TaskStatus!
    $name: String!
    $isRecurring: Boolean!
    $start: DateTime!
    $end: DateTime!
    $credit: Int!
    $comment: String
  ) {
    createTask(
      roomNumber: $roomNumber
      type: $type
      status: $status
      name: $name
      isRecurring: $isRecurring
      start: $start
      end: $end
      credit: $credit
      comment: $comment
    ) {
      taskId
      roomNumber
      type
      status
      name
      isRecurring
      start
      end
      credit
      comment
    }
  }
`;
