import { gql } from "apollo-server-express";

const notificationType = gql`
  type NotificationDTO {
    id: ID!
    authorId: ID
    title: String!
    message: String!
    createdAt: DateTime!
    recipients: [NotificationReceivedDTO!]
  }

  type NotificationReceivedDTO {
    id: ID!
    notificationId: ID!
    recipientId: ID!
    seen: Boolean!
  }

  input UpdateNotificationDTO {
    authorId: ID
    title: String
    message: String
    createdAt: DateTime
  }

  extend type Query {
    getNotificationsByRoomIds(roomIds: [Int!]): [NotificationReceivedDTO!]
    getNotificationById(id: ID!): NotificationReceivedDTO!
  }

  extend type Mutation {
    sendNotification(
      authorId: ID!
      title: String!
      message: String!
      roomIds: [Int!]
    ): NotificationDTO!
    deleteUserNotification(notificationId: ID!): NotificationDTO!
    updateSeenNotification(notificationId: ID!): NotificationReceivedDTO!
    updateNotification(
      notificationId: ID!
      notification: UpdateNotificationDTO!
    ): NotificationDTO!
    sendAnnouncement(
      title: String
      message: String
      userId: ID
    ): NotificationDTO!
  }
`;

export default notificationType;
