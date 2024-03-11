import { gql } from "apollo-server-express";

const notificationType = gql`
  type NotificationDTO {
    id: ID!
    authorId: ID
    title: String!
    message: String!
    createdAt: String!
    recipients: [NotificationRecievedDTO!]
  }

  type NotificationRecievedDTO {
    id: ID!
    notificationId: ID!
    recipientId: ID!
    seen: Boolean!
  }

  extend type Query {
    notificationsByUserId(id: ID!): [NotificationRecievedDTO!]
    notificationById(id: ID!): NotificationRecievedDTO!
  }

  extend type Mutation {
    sendNotification(
      authorId: ID!,
      title: String!,
      message: String!,
      recipientId: [ID!]
    ): NotificationDTO!
    deleteUserNotification(
      notificationId: ID!
    ): NotificationDTO!
    updateSeenNotification(
      notificationId: ID!
    ): NotificationRecievedDTO!
    sendAnnouncement(
      title: String,
      message: String, 
      userId: ID
    ): NotificationDTO!
  }
`;

export default notificationType;
