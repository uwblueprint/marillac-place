import { gql } from "@apollo/client";

export const CREATE_TASK = gql`
  mutation CreateTask($task: InputTaskDTO!) {
    createTask(task: $task) {
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

export const UPDATE_TASK = gql`
  mutation UpdateTASK($taskId: Int!, $task: InputTaskDTO!) {
    updateTask(taskId: $taskId, task: $task) {
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

export const DELETE_TASK = gql`
  mutation DeleteStaff($taskId: Int!) {
    deleteTask(taskId: $taskId) {
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

export const ASSIGN_TASK = gql`
  mutation AssignTask($taskAssigned: InputTaskAssignedDTO!) {
    assignTask(taskAssigned: $taskAssigned) {
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

export const CHANGE_TASK_STATUS = gql`
  mutation ChangeTaskStatus($taskAssignedId: Int!, $status: Status!) {
    changeTaskStatus(taskAssignedId: $taskAssignedId, status: $status) {
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
