import { gql } from "apollo-server-express";

// TODO: Look into custom types for dates and date time types

const residentType = gql`
  type ResidentDTO {
    userId: Int!
    residentId: Int!
    email: String!
    phoneNumber: String
    firstName: String!
    lastName: String!
    displayName: String
    profilePictureURL: String
    isActive: Boolean!
    birthDate: Date!
    roomNumber: Int!
    credits: Float!
    dateJoined: Date!
    dateLeft: Date
    notes: String
  }

  input CreateResidentDTO {
    email: String!
    password: String!
    phoneNumber: String
    firstName: String!
    lastName: String!
    displayName: String
    profilePictureURL: String
    residentId: Int!
    birthDate: Date!
    roomNumber: Int!
    credits: Float
    dateJoined: Date
    dateLeft: Date
    notes: String
  }

  input UpdateResidentDTO {
    email: String
    password: String
    phoneNumber: String
    firstName: String
    lastName: String
    displayName: String
    profilePictureURL: String
    residentId: Int
    birthDate: Date
    roomNumber: Int
    credits: Float
    dateJoined: Date
    dateLeft: Date
    notes: String
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
    setResidentInactive(userId: ID!): ResidentDTO!
  }
`;

export default residentType;
