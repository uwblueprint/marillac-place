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

export const GET_SYSTEM_BADGES = gql`
  query {
    getSystemBadges {
      badge_id
      name
      description
      icon
      is_active
      badge_level {
        level
        benchmark
        marillac_bucks
      }
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
export const GET_MARILLAC_BUCKS = gql`
  query getMarillacBucks($participantId: Int!) {
    getParticipantById(participantId: $participantId) {
      marillac_bucks
    }
  }
`;

export const GET_PARTICIPANT_BY_ROOM = gql`
  query getParticipantByRoom($room_number: Int!) {
    getParticipantByRoom(room_number: $room_number) {
      participant_id
      marillac_bucks
      room_number
      assigned_tasks {
        assigned_task_id
        task_name
        task_status
        task_type
        goal_name
        goal_description
        start_date
        end_date
        marillac_bucks_addition
        marillac_bucks_deduction
        comment
      }
    }
  }
`;

export const HAS_COMPLETED_ALL_REQUIRED_TASKS = gql`
  query hasCompletedAllRequiredTasks($participantId: Int!) {
    hasCompletedAllRequiredTasks(participantId: $participantId)
  }
`;

export const GET_PARTICIPANTS_BY_ROOMS = gql`
  query getParticipantsByRooms($room_numbers: [Int!]!) {
    getParticipantsByRooms(room_numbers: $room_numbers) {
      participant_id
      room_number
    }
  }
`;

export const GET_PARTICIPANT_BY_ID = gql`
  query getParticipantById($participantId: Int!) {
    getParticipantById(participantId: $participantId) {
      participant_id
      marillac_bucks
      marillac_bucks_goal
      room_number
    }
  }
`;

export const GET_ALL_ANNOUNCEMENTS = gql`
  query getAllAnnouncements {
    getAllAnnouncements {
      announcement_id
      priority
      creation_date
      message
      user_announcements {
        participant_id
        read
        pinned
      }
    }
  }
`;

export const GET_ANNOUNCEMENTS_IN_DATE_RANGE = gql`
  query getAnnouncementsInDateRange($start: String!, $end: String!) {
    getAnnouncementsInDateRange(start: $start, end: $end) {
      announcement_id
      creation_date
      message
      user_announcements {
        participant {
          room_number
        }
      }
    }
  }
`;

export const GET_ANNOUNCEMENTS_BY_PARTICIPANTS = gql`
  query getAnnouncementsByParticipants($participant_ids: [Int!]!) {
    getAnnouncementsByParticipants(participant_ids: $participant_ids) {
      announcement_id
      priority
      creation_date
      message
      user_announcements {
        participant_id
      }
    }
  }
`;

export const GET_ANNOUNCEMENTS_BY_PARTICIPANT_ID_AND_DATE = gql`
  query getAnnouncementsByParticipantIdAndDate(
    $participant_id: Int!
    $start_date: String!
    $end_date: String!
  ) {
    getAnnouncementsByParticipantIdAndDate(
      participant_id: $participant_id
      start_date: $start_date
      end_date: $end_date
    ) {
      announcement_id
      priority
      creation_date
      message
      user_announcements {
        participant_id
      }
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
  query getTasksByType($type: [TaskType!]!) {
    getTasksByType(type: $type) {
      task_id
      task_name
      task_type
      recurrence_preference
      repeat_days
      time_preference
      start_time
      end_time
      marillac_bucks_addition
      marillac_bucks_deduction
      comment
    }
  }
`;

export const GET_TASKS_BY_RECURRENCE_FREQUENCY = gql`
  query GetTasksByRecurrenceFrequency(
    $recurrencePreference: RecurrenceFrequency!
  ) {
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

export const GET_CUSTOM_BADGES = gql`
  query getCustomBadges {
    getCustomBadges {
      badge_id
      name
      description
      is_active
      icon
      badge_level {
        level
        benchmark
        marillac_bucks
      }
    }
  }
`;

export const GET_ASSIGNED_TASKS_BY_PARTICIPANT_ID_AND_DATE = gql`
  query getAssignedTasksByParticipantIdAndDate(
    $participantId: Int!
    $date: String!
  ) {
    getAssignedTasksByParticipantIdAndDate(
      participantId: $participantId
      date: $date
    ) {
      assigned_task_id
      task_name
      task_status
      task_type
      start_date
      end_date
      comment
    }
  }
`;

export const GET_ASSIGNED_TASKS = gql`
  query getAssignedTasks($participant_id: Int!) {
    getAssignedTasks(participant_id: $participant_id) {
      SPECIFIC {
        id
        title
        start
        end
        allDay
        task_status
        task_type
        marillacBucksAddition
        marillac_bucks_deduction
        comment
      }
      ANYTIME {
        id
        title
        start
        end
        allDay
        task_status
        task_type
        marillacBucksAddition
        marillac_bucks_deduction
        comment
      }
      ANYDAY {
        id
        title
        start
        end
        allDay
        task_status
        task_type
        marillacBucksAddition
        marillac_bucks_deduction
        comment
      }
    }
  }
`;
