import { gql } from "apollo-server-express";

const notificationType = gql`
  type NotificationDTO {
    id: ID!
    message: String!
    createdAt: DateTime
    authorId: Int
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
    notificationId: Int!
    notification: NotificationDTO
    recipientId: Int!
    seen: Boolean!
  }

  input UpdateNotificationDTO {
    authorId: Int
    message: String
    createdAt: DateTime
  }

  input CreateNotificationDTO {
    authorId: Int
    message: String!
    createdAt: DateTime
  }

  extend type Query {
    getNotificationsByIds(notificationIds: [ID!]): [NotificationReceivedDTO!]
    getNotificationByResident(residentId: Int!): [NotificationReceivedDTO!]
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
