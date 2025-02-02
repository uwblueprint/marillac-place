import { gql } from "@apollo/client";

export const CREATE_NOTIFICATION_GROUP = gql`
  mutation CreateNotificationGroup($roomIds: [Int!]) {
    createNotificationGroup(roomIds: $roomIds) {
      id
      announcementGroup
      recipients {
        userId
        residentId
        roomNumber
        credits
        dateJoined
        dateLeft
      }
    }
  }
`;

export const CREATE_ANNOUNCEMENT_GROUP = gql`
  mutation CreateAnnouncementGroup {
    createAnnouncementGroup {
      id
      announcementGroup
      recipients {
        userId
        residentId
        roomNumber
        credits
        dateJoined
        dateLeft
      }
    }
  }
`;

export const SEND_NOTIFICATION_TO_GROUP = gql`
  mutation SendNotificationToGroup(
    $groupId: ID!
    $notification: CreateNotificationDTO!
  ) {
    sendNotificationToGroup(groupId: $groupId, notification: $notification) {
      id
      message
      createdAt
      authorId
    }
  }
`;

export const DELETE_NOTIFICATION_GROUP = gql`
  mutation DeleteNotificationGroup($groupId: ID!) {
    deleteNotificationGroup(groupId: $groupId) {
      id
      announcementGroup
    }
  }
`;

export const UPDATE_NOTIFICATION_BY_ID = gql`
  mutation UpdateNotificationById(
    $notificationId: ID!
    $notification: UpdateNotificationDTO!
  ) {
    updateNotificationById(
      notificationId: $notificationId
      notification: $notification
    ) {
      id
      message
      createdAt
      authorId
    }
  }
`;

export const DELETE_NOTIFICATION_BY_IDS = gql`
  mutation DeleteNotificationByIds($notificationIds: [ID!]) {
    deleteNotificationByIds(notificationIds: $notificationIds)
  }
`;

export const UPDATE_SEEN_NOTIFICATION = gql`
  mutation UpdateSeenNotification($notificationSeenId: ID!) {
    updateSeenNotification(notificationSeenId: $notificationSeenId) {
      id
      notificationId
      recipientId
      seen
    }
  }
`;
