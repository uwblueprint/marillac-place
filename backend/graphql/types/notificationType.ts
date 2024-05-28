import { gql } from "apollo-server-express";

const notificationType = gql`
  type NotificationDTO {
    id: ID!
    authorId: ID
    title: String!
    message: String!
    createdAt: String!
    recipients: [NotificationReceivedDTO!]
  }

  type NotificationReceivedDTO {
    id: ID!
    notificationId: ID!
    recipientId: ID!
    seen: Boolean!
  }

  extend type Query {
    getNotificationsByUserId(userId: ID!): [NotificationReceivedDTO!]
    getNotificationById(id: ID!): NotificationReceivedDTO!
  }

  extend type Mutation {
    sendNotification(
      authorId: ID!
      title: String!
      message: String!
      recipientIds: [ID!]
    ): NotificationDTO!
    deleteUserNotification(notificationId: ID!): NotificationDTO!
    updateSeenNotification(notificationId: ID!): NotificationReceivedDTO!
    sendAnnouncement(
      title: String
      message: String
      userId: ID
    ): NotificationDTO!
    updateAnnouncement(
      announcementId: ID!
      announcement: NotificationDTO!
    ): NotificationDTO!
  }
`;

export default notificationType;
