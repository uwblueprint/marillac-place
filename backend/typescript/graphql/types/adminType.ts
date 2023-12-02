import { gql } from "apollo-server-express";

const adminType = gql`
  type NotificationDTO {
    id: ID!
    message: String!
    createdAt: String!
    residents: [NotificationResidentDTO!]
  }

  type NotificationResidentDTO {
    notificationId: ID!
    residentId: ID!
    seen: Boolean!
  }

  extend type Query {
    notificationById(id: ID!): NotificationDTO!
    getAllNotifications: [NotificationDTO!]
  }

  extend type Mutation {
    sendNotification(message: String, resident_id: ID): NotificationDTO!
    sendAnnouncement(message: String): NotificationDTO!
  }
`;

export default adminType;
