import { gql } from "apollo-server-express";

const notificationType = gql`
  type NotificationDTO {
    id: ID!
    authorId: ID
    title: String!
    message: String!
    createdAt: String!
    residents: [NotificationSentDTO!]
  }

  type NotificationSentDTO {
    id: ID!
    notificationId: ID!
    recipientId: ID!
    seen: Boolean!
  }

  extend type Query {
    
    notificationById(id: ID!): NotificationDTO!
  }

  extend type Mutation {

    sendNotification(
      message: String
      residentId: ID
      staffId: ID
    ): NotificationDTO!
    sendAnnouncement(message: String, staffId: ID): NotificationDTO!
  }
`;

export default notificationType;
