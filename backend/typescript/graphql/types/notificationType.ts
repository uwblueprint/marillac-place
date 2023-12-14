import { gql } from "apollo-server-express";

const adminType = gql`
  type NotificationDTO {
    id: ID!
    authorId: ID!
    message: String!
    createdAt: String!
    residents: [NotificationResidentDTO!]
  }

  type NotificationResidentDTO {
    notificationId: ID!
    residentId: ID!
    seen: Boolean!
    isDeleted: Boolean!
  }

  extend type Query {
    notificationById(id: ID!): NotificationDTO!
    getAllNotifications: [NotificationDTO!]
  }

  extend type Mutation {
    sendNotification(
      message: String
      residentId: ID
      staffId: ID
    ): NotificationDTO!
    sendAnnouncement(message: String, staffId: ID): NotificationDTO!
    deleteNotificationForResident(notifId: ID, residentId: ID): NotificationDTO!
    updateSeenForResident(notifId: ID, residentId: ID): NotificationDTO!
  }
`;

export default adminType;
