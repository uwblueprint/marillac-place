import { gql } from "@apollo/client";

export const GET_TASK_BY_ID = gql`
  query getTaskById($taskId: Int!) {
    getTaskById(taskId: $taskId) {
      id
      type
      title
      description
      creditValue
      endDate
      recurrenceFrequency
      specificDay
      repeatDays
    }
  }
`;

export const GET_TASKS_BY_TYPE = gql`
  query getTaskById($type: TaskType!) {
    getTasksByType(type: $type) {
      id
      type
      title
      description
      creditValue
      endDate
      recurrenceFrequency
      specificDay
      repeatDays
    }
  }
`;

export const GET_TASKS_BY_ASSIGNEE_ID = gql`
  query getTasksByAssigneeId($assigneeId: Int!) {
    getTasksByAssigneeId(assigneeId: $assigneeId) {
      id
      taskId
      assigneeId
      assignerId
      status
      startDate
      comments
    }
  }
`;

export const GET_TASKS_BY_ASSIGNER_ID = gql`
  query GetTasksByAssignerId($assignerId: Int!) {
    getTasksByAssignerId(assignerId: $assignerId) {
      id
      taskId
      assigneeId
      assignerId
      status
      startDate
      comments
    }
  }
`;

export const GET_TASKS_BY_START_DATE = gql`
  query GetTasksByStartDate($startDate: DateTime!) {
    getTasksByStartDate(startDate: $startDate) {
      id
      taskId
      assigneeId
      assignerId
      status
      startDate
      comments
    }
  }
`;

export const GET_TASKS_BY_STATUS = gql`
  query GetTasksByStatus($status: Status!) {
    getTasksByStatus(status: $status) {
      id
      taskId
      assigneeId
      assignerId
      status
      startDate
      comments
    }
  }
`;
