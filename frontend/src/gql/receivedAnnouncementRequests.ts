import { gql } from "@apollo/client";

export const GET_RECEIVED_ANNOUNCEMENTS = gql`
  query getReceivedAnnouncements(
    $pid: Int!
    $unread: Boolean
    $pinned: Boolean
    $important: Boolean
  ) {
    getReceivedAnnouncements(
      pid: $pid
      unread: $unread
      pinned: $pinned
      important: $important
    ) {
      aid
      pid
      read
      pinned
      announcement {
        aid
        date
        topic
        message
        priority
      }
    }
  }
`;

export const UPDATE_RECEIVED_ANNOUNCEMENT = gql`
  mutation updateReceivedAnnouncement(
    $aid: Int!
    $pid: Int!
    $pinned: Boolean
    $read: Boolean
  ) {
    updateReceivedAnnouncement(
      aid: $aid
      pid: $pid
      pinned: $pinned
      read: $read
    ) {
      aid
      pid
      read
      pinned
    }
  }
`;
