import { gql } from "@apollo/client";

export const GET_NUMBER_OF_ASSIGNED_TASKS_BY_ROOM = gql`
  query getNumberOfAssignedTasksByRoom {
    getNumberOfAssignedTasksByRoom
  }
`;

export const GET_ASSIGNED_TASKS_FOR_TODAY = gql`
  query getAssignedTasksForToday($pid: Int!) {
    getAssignedTasksForToday(pid: $pid) {
      aid
      pid
      name
      type
      status
      value
      penalty
      comment
      start_date
      end_date
    }
  }
`;

export const GET_ASSIGNED_TASKS_BY_WEEK = gql`
  query getAssignedTasksByWeek($pid: Int!, $weekStart: Date!) {
    getAssignedTasksByWeek(pid: $pid, weekStart: $weekStart) {
      aid
      pid
      name
      type
      status
      value
      penalty
      comment
      start_date
      end_date
    }
  }
`;

export const HAS_COMPLETED_ALL_REQUIRED_TASKS = gql`
  query hasCompletedAllRequiredTasks($pid: Int!) {
    hasCompletedAllRequiredTasks(pid: $pid)
  }
`;

export const CREATE_ASSIGNED_TASK = gql`
  mutation createAssignedTask(
    $pid: Int!
    $tid: Int!
    $name: String!
    $type: TaskType!
    $value: Int!
    $penalty: Int!
    $startDate: Date!
    $endDate: Date!
    $comment: String
  ) {
    createAssignedTask(
      pid: $pid
      tid: $tid
      name: $name
      type: $type
      value: $value
      penalty: $penalty
      start_date: $startDate
      end_date: $endDate
      comment: $comment
    ) {
      aid
      tid
      pid
      name
      type
      status
      value
      penalty
      comment
      start_date
      end_date
    }
  }
`;

export const UPDATE_ASSIGNED_TASK = gql`
  mutation updateAssignedTask(
    $aid: Int!
    $pid: Int
    $name: String
    $type: TaskType
    $value: Int
    $penalty: Int
    $startDate: Date
    $endDate: Date
    $comment: String
  ) {
    updateAssignedTask(
      aid: $aid
      pid: $pid
      name: $name
      type: $type
      value: $value
      penalty: $penalty
      start_date: $startDate
      end_date: $endDate
      comment: $comment
    ) {
      aid
      pid
      name
      type
      status
      value
      penalty
      comment
      start_date
      end_date
    }
  }
`;

export const UPDATE_ASSIGNED_TASK_STATUS = gql`
  mutation updateAssignedTaskStatus($aid: Int!, $status: TaskStatus!) {
    updateAssignedTaskStatus(aid: $aid, status: $status) {
      aid
      pid
      name
      type
      status
      value
      penalty
      comment
      start_date
      end_date
    }
  }
`;

export const DELETE_ASSIGNED_TASK = gql`
  mutation deleteAssignedTask($aid: Int!) {
    deleteAssignedTask(aid: $aid) {
      aid
      pid
      name
      type
      status
      value
      penalty
      comment
      start_date
      end_date
    }
  }
`;
