import { gql } from "@apollo/client";

export const GET_TASKS_BY_TYPE = gql`
  query getTasksByType($type: TaskType!) {
    getTasksByType(type: $type) {
      tid
      type
      name
      day_preference
      days
      time_preference
      start_time
      end_time
      value
      penalty
      comment
    }
  }
`;

export const CREATE_TASK = gql`
  mutation createTask(
    $type: TaskType!
    $name: String
    $dayPreference: DayPreference!
    $days: [DayOfWeek!]!
    $timePreference: TimePreference!
    $value: Int!
    $penalty: Int!
    $startTime: String
    $endTime: String
    $comment: String
  ) {
    createTask(
      type: $type
      name: $name
      value: $value
      penalty: $penalty
      day_preference: $dayPreference
      days: $days
      time_preference: $timePreference
      start_time: $startTime
      end_time: $endTime
      comment: $comment
    ) {
      tid
      type
      name
      day_preference
      days
      time_preference
      start_time
      end_time
      value
      penalty
      comment
    }
  }
`;

export const UPDATE_TASK = gql`
  mutation updateTask(
    $id: Int!
    $type: TaskType
    $name: String
    $dayPreference: DayPreference
    $days: [DayOfWeek!]
    $timePreference: TimePreference
    $value: Int
    $penalty: Int
    $startTime: String
    $endTime: String
    $comment: String
  ) {
    updateTask(
      tid: $id
      type: $type
      name: $name
      day_preference: $dayPreference
      days: $days
      time_preference: $timePreference
      value: $value
      penalty: $penalty
      start_time: $startTime
      end_time: $endTime
      comment: $comment
    ) {
      tid
      type
      name
      day_preference
      days
      time_preference
      start_time
      end_time
      value
      penalty
      comment
    }
  }
`;

export const DELETE_TASK = gql`
  mutation deleteTask($tid: Int!) {
    deleteTask(tid: $tid) {
      tid
      type
      name
      day_preference
      days
      time_preference
      start_time
      end_time
      value
      penalty
      comment
    }
  }
`;
