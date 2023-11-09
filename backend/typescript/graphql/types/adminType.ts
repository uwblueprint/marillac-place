import { gql } from "apollo-server-express";
import { Prisma } from "@prisma/client"

const adminType = gql`

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