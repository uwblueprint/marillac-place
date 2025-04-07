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

export const CREATE_ASSIGNED_TASK = gql`
  mutation createAssignedTask(
    $userID: Int
    $type: TaskType!
    $name: String!
    $recurrencePreference: RecurrenceFrequency
    $repeatDays: [String]
    $timePreference: TimeOption!
    $start: String
    $end: String
    $credit: Int!
    $deduction: Int
    $comment: String
  ) {
    createAssignedTask(
      userID: $userID
      type: $type
      name: $name
      recurrencePreference: $recurrencePreference
      repeatDays: $repeatDays
      timePreference: $timePreference
      start: $start
      end: $end
      credit: $credit
      deduction: $deduction
      comment: $comment
    ) {
      assignedTaskId
      userID
      type
      name
      recurrencePreference
      repeatDays
      timePreference
      start
      end
      credit
      deduction
      comment
    }
  }
`;
