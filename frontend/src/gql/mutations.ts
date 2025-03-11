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
    $type: TaskType
    $name: String
    $recurrencePreference: RecurrenceFrequency
    $repeatDays: [DaysOfWeek]
    $timePreference: TimeOption 
    $start: String
    $end: String
    $credit: Int
    $deduction: Int
    $comment: String
  ) {
    createTask(
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
      taskId
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

export const UPDATE_TASK = gql`
  mutation updateTask(
    $taskId: Int!
    $type: TaskType
    $name: String
    $recurrencePreference: RecurrenceFrequency
    $repeatDays: [DaysOfWeek]
    $timePreference: TimeOption
    $start: String
    $end: String
    $credit: Int
    $deduction: Int
    $comment: String
  ) {
    updateTask(
      taskId: $taskId
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
      taskId
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

export const DELETE_TASK = gql`
  mutation deleteTask($taskId: Int!) {
    deleteTask(taskId: $taskId) {
      taskId
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
