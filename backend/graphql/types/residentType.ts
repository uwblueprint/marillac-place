import { gql } from "apollo-server-express";

// TODO: Look into custom types for dates and date time types

const residentType = gql`
  type ResidentDTO {
    userId: Int!
    residentId: Int!
    isActive: Boolean!
    roomNumber: Int!
    credits: Float!
    dateJoined: Date!
    dateLeft: Date
    notificationGroup: [NotificationGroupDTO!]!
    notificationRecieved: [NotificationReceivedDTO]!
  }

  input CreateResidentDTO {
    password: String!
    residentId: Int!
    roomNumber: Int!
    credits: Float
    dateJoined: Date
    dateLeft: Date
  }

  input UpdateResidentDTO {
    residentId: Int
    roomNumber: Int
    credits: Float
    dateJoined: Date
    dateLeft: Date
  }

  enum RedeemCreditResponse {
    SUCCESS
    NOT_ENOUGH_CREDITS
    INVALID_ID
  }

  extend type Query {
    getResidentsByIds(userIds: [ID!]): [ResidentDTO!]
    getAllResidents: [ResidentDTO!]
    getActiveResidents: [ResidentDTO!]
  }

  extend type Mutation {
    addResident(resident: CreateResidentDTO!): ResidentDTO!
    updateResident(userId: ID!, resident: UpdateResidentDTO!): ResidentDTO!
    deleteResident(userId: ID!): ResidentDTO!
    redeemCredits(userId: ID!, credits: Float!): RedeemCreditResponse!
  }
`;

export default residentType;
