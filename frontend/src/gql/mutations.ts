import { gql } from "@apollo/client";

// Participant Mutations
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

// Task Mutations
export const CREATE_TASK = gql`
  mutation createTask(
    $type: TaskType!
    $name: String!
    $credit: Int!
    $start: DateTime!
    $end: DateTime!
    $isRecurring: Boolean!
    $repeatDays: [DaysOfWeek!]
  ) {
    createTask(
      type: $type
      name: $name
      credit: $credit
      start: $start
      end: $end
      isRecurring: $isRecurring
      repeatDays: $repeatDays
    )
  }
`;

export const UPDATE_TASK = gql`
  mutation updateTask(
    $taskId: Int!
    $type: TaskType
    $name: String
    $credit: Int
    $start: DateTime
    $end: DateTime
    $isRecurring: Boolean
    $repeatDays: [DaysOfWeek]
  ) {
    updateTask(
      taskId: $taskId
      type: $type
      name: $name
      credit: $credit
      start: $start
      end: $end
      isRecurring: $isRecurring
      repeatDays: $repeatDays
    )
  }
`;

export const DELETE_TASK = gql`
  mutation deleteTask($taskId: Int!) {
    deleteTask(taskId: $taskId)
  }
`;
