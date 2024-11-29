import { gql } from "apollo-server-express";

const notificationType = gql`
  type NotificationDTO {
    id: ID!
    message: String!
    createdAt: DateTime
    authorId: ID
    recipients: [NotificationReceivedDTO]
  }

  type NotificationGroupDTO {
    id: ID!
    recipients: [ResidentDTO!]
    notifications: [NotificationDTO!]
    announcementGroup: Boolean!
  }

  type NotificationReceivedDTO {
    id: ID!
    notificationId: ID!
    notification: NotificationDTO
    recipientId: ID!
    seen: Boolean!
  }

  input UpdateNotificationDTO {
    authorId: ID
    message: String
    createdAt: DateTime
  }

  input CreateNotificationDTO {
    authorId: ID
    message: String!
    createdAt: DateTime
  }

  extend type Query {
    getNotificationsByIds(notificationIds: [ID!]): [NotificationReceivedDTO!]
    getNotificationByResident(residentId: ID!): [NotificationReceivedDTO!]
    getAllGroupsAndNotifications: [NotificationGroupDTO!]
  }

  extend type Mutation {
    createNotificationGroup(roomIds: [Int!]): NotificationGroupDTO!
    createAnnouncementGroup: NotificationGroupDTO!
    sendNotificationToGroup(
      groupId: ID!
      notification: CreateNotificationDTO!
    ): NotificationDTO!
    deleteNotificationGroup(groupId: ID!): NotificationGroupDTO!
    updateNotificationById(
      notificationId: ID!
      notification: UpdateNotificationDTO!
    ): NotificationDTO!
    deleteNotificationByIds(notificationIds: [ID!]): Boolean!
    updateSeenNotification(notificationSeenId: ID!): NotificationReceivedDTO!
  }
`;

export default notificationType;
