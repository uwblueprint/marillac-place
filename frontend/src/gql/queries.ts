import { gql } from "@apollo/client";

// Participant Queries

export const GET_AVAILABLE_ROOMS = gql`
  query getAvailableRooms {
    getAvailableRooms
  }
`;

export const GET_ALL_PARTICIPANTS = gql`
  query getAllParticipants {
    getAllParticipants {
      participantId
      roomNumber
      arrival
      departure
      password
      credit
    }
  }
`;

export const GET_PARTICIPANT_BY_ID = gql`
  query getParticipantById($participantId: String) {
    getParticipantById(participantId: $participantId) {
      participantId
      roomNumber
      arrival
      departure
      password
      credit
    }
  }
`;

// Task Queries
export const GET_TASK_BY_ID = gql`
  query getTaskById($taskId: Int!) {
    getTaskById(taskId: $taskId) {
      type
      name
      credit
      start
      end
      isRecurring
      repeatDays
    }
  }
`;
export const GET_TASKS_BY_TYPE = gql`
  query GetTasksByType($type: TaskType!) {
    getTasksByType(type: $type) {
      name
      credit
      isRecurring
      repeatDays
      start
      end
    }
  }
`;
export const GET_TASKS_BY_START_DATE = gql`
  query GetTasksByStartDate($startDate: DateTime!) {
    getTasksByStartDate(startDate: $startDate) {
      taskId
      name
      credit
    }
  }
`;
