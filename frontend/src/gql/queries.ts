import { gql } from "@apollo/client";

export const GET_AVAILABLE_ROOMS = gql`
    query getAvailableRooms {
        getAvailableRooms
    }
`;

export const GET_PAST_PARTICIPANTS = gql`
  query getPastParticipants {
    getPastParticipants {
      participant_id
      arrival_date
      departure_date
    }
  }
`;

export const GET_CURRENT_PARTICIPANTS = gql`
  query getCurrentParticipants {
    getCurrentParticipants {
      participant_id
      room_number
      arrival_date
      password
    }
  }
`;

export const GET_PARTICIPANT_BY_ROOM = gql`
  query getParticipantByRoom($room_number: Int!) {
    getParticipantByRoom(room_number: $room_number) {
        participant_id
        marillac_bucks
        room_number
    }
  }
`;

export const GET_PARTICIPANT_BY_ID = gql`
    query getParticipantById($participantId: String!) {
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

export const GET_ALL_ANNOUNCEMENTS = gql`
    query getAllAnnouncements {
        getAllAnnouncements {
            announcementId
            from
            to
            createdAt
            message
        }
    }
`;

export const GET_ANNOUNCEMENTS_IN_DATE_RANGE = gql`
    query getAllAnnouncements {
        getAllAnnouncements {
            announcementId
            createdAt
            message
        }
    }
`;

export const GET_ANNOUNCEMENT_BY_ROOMS = gql`
    query getAnnouncementByRooms($rooms: [Int]) {
        getAnnouncementByRooms(rooms: $rooms) {
            announcementId
            from
            to
            createdAt
            message
        }
    }
`;

export const GET_NOTES = gql`
  query getNotes {
    getNotes {
      note_id
      message
      creation_date
    }
  }      
`;

export const GET_TASK_BY_ID = gql`
    query getTaskById($taskId: Int!) {
        getTaskById(taskId: $taskId) {
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
export const GET_TASKS_BY_TYPE = gql`
    query GetTasksByType($type: TaskType!) {
        getTasksByType(type: $type) {
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
export const GET_TASKS_BY_RECURRENCE_FREQUENCY = gql`
    query GetTasksByRecurrenceFrequency($recurrencePreference: RecurrenceFrequency!) {
        getTasksByRecurrenceFrequency(recurrencePreference: $recurrencePreference) {
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