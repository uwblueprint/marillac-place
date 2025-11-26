import { gql } from "@apollo/client";

export const GET_ANNOUNCEMENTS_FROM_TODAY = gql`
  query getAnnouncementsFromToday {
    getAnnouncementsFromToday {
      aid
      date
      message
      priority
      ReceivedAnnouncement {
        pid
        participant {
          room
        }
      }
    }
  }
`;

export const GET_ANNOUNCEMENTS_SENT_TO_PARTICIPANTS = gql`
  query getAnnouncementsSentToParticipants($pids: [Int!]!) {
    getAnnouncementsSentToParticipants(pids: $pids) {
      aid
      date
      message
      priority
      ReceivedAnnouncement {
        pid
        participant {
          room
        }
      }
    }
  }
`;

export const CREATE_ANNOUNCEMENT = gql`
  mutation createAnnouncement(
    $priority: Priority!
    $pids: [Int!]!
    $message: String!
  ) {
    createAnnouncement(priority: $priority, pids: $pids, message: $message) {
      aid
      date
      message
      priority
    }
  }
`;

export const UPDATE_ANNOUNCEMENT = gql`
  mutation updateAnnouncement(
    $aid: Int!
    $priority: Priority
    $message: String
  ) {
    updateAnnouncement(aid: $aid, priority: $priority, message: $message) {
      aid
      date
      message
      priority
    }
  }
`;

export const DELETE_ANNOUNCEMENT = gql`
  mutation deleteAnnouncement($aid: Int!) {
    deleteAnnouncement(aid: $aid) {
      aid
      date
      message
      priority
    }
  }
`;
