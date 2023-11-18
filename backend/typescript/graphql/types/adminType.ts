import { gql } from "apollo-server-express";
import { Prisma } from "@prisma/client"

const adminType = gql`

  type NotificationDTO {
    id: ID!
    message: String!
    created_at: String!
    author_id: ID!
  }

  extend type Query {
    notificationById(id: ID!): NotificationDTO!
    activeResidents: [ResidentDTO]
    getAllNotifications: [NotificationDTO]
  }

  extend type Mutation {
    sendNotification(message: String, resident_id: ID): NotificationDTO!
    sendAnnouncement(message: String): NotificationDTO!
  }
`;

export default adminType;
/*
type NotificationUserDTO {
    notification_id: ID!
    recipient_id: ID!
  }
*/