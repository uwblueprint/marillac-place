import { gql } from "apollo-server-express";
import { Prisma } from "@prisma/client"

const adminType = gql`

  type NotificationDTO {
    id: ID!
    author_id: ID!
    message: String!
    created_at: String!
    residents: [NotificationUserDTO]!
  }

  type NotificationUserDTO {
    notification_id: ID!
    recipient_id: ID!
  }

  type ResidentDTO {
    id: ID!
    first_name: String!
    last_name: String!
    email: String!
    phone_number: String
    display_name: String!
    profile_picture_link: String
    birthdate: String
    credits: Float
    date_joined: String!
    date_left: String
  }

  extend type Query {
    notificationById(id: ID!): String
    activeResidents: String
  }

  extend type Mutation {
    sendNotification(message: String, resident_id: ID): String
    sendAnnouncement(message: String): String
  }
`;

export default adminType;