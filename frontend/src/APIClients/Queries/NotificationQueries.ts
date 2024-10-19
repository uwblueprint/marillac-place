import { gql } from "@apollo/client";

export const GET_NOTIFICATIONS_BY_USER_ID = gql`
  query GetNotificationsByUserId($userId: ID!) {
    getNotificationsByUserId(userId: $userId) {
      id
      notificationId
      recipientId
      seen
    }
  }
`;

export const GET_NOTIFCATION_BY_ID = gql`
  query GetNotificationById($id: ID!) {
    getNotificationById(id: $id) {
      id
      notificationId
      recipientId
      seen
    }
  }
`;
