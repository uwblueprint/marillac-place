import { gql } from "@apollo/client";

export const SEND_NOTIFICATION = gql`
  mutation SendNotification(
    $authorId: ID!
    $title: String!
    $message: String!
    $recipientIds: [ID!]
  ) {
    sendNotification(
      authorId: $authorId
      title: $title
      message: $message
      recipientIds: $recipientIds
    ) {
      id
      authorId
      title
      message
      createdAt
    }
  }
`;

export const DELETE_USER_NOTIFICATION = gql`
  mutation DeleteUserNotification($notificationId: ID!) {
    deleteUserNotification(notificationId: $notificationId) {
      id
      authorId
      title
      message
      createdAt
    }
  }
`;

export const UPDATE_SEEN_NOTIFICATION = gql`
  mutation UpdateSeenNotification($notificationId: ID!) {
    updateSeenNotification(notificationId: $notificationId) {
      id
      notificationId
      recipientId
      seen
    }
  }
`;

export const SEND_ANNOUNCEMENT = gql`
  mutation SendAnnouncement($title: String, $message: String, $userId: ID) {
    sendAnnouncement(title: $title, message: $message, userId: $userId) {
      id
      authorId
      title
      message
      createdAt
    }
  }
`;
