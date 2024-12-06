import { gql } from "@apollo/client";

export const GET_NOTIFICATIONS_BY_IDS = gql`
  query getNotificationsByIds($notificationIds: [ID!]) {
    getNotificationsByIds(notificationIds: $notificationIds) {
      id
      notificationId
      recipientId
      seen
      notification {
        id
        message
        createdAt
        authorId
      }
    }
  }
`;

export const GET_NOTIFCATION_BY_RESIDENT = gql`
  query getNotificationByResident($residentId: ID!) {
    getNotificationByResident(residentId: $id) {
      id
      notificationId
      recipientId
      seen
      notification {
        id
        message
        createdAt
        authorId
      }
    }
  }
`;

export const GET_ALL_GROUPS_AND_NOTIFICATIONS = gql`
  query getAllGroupsAndNotifications {
    getAllGroupsAndNotifications {
      id
      announcementGroup
      notifications {
        id
        message
        createdAt
        authorId
      }
      recipients {
        userId
        residentId
        displayName
        profilePictureURL
        isActive
        roomNumber
        credits
        dateJoined
        dateLeft
      }
    }
  }
`;
