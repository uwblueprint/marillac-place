import { gql } from "apollo-server-express";

// TODO: Look into custom types for dates and date time types

const residentType = gql`
  type ResidentDTO {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    phoneNumber: String
    displayName: String!
    profilePictureLink: String
    birthdate: Date
    credits: Float
    dateJoined: DateTime!
    dateLeft: DateTime
  }

  input CreateResidentDTO {
    firstName: String!
    lastName: String!
    email: String!
    phoneNumber: String
    displayName: String!
    profilePictureLink: String
    birthdate: Date
    credits: Float
    dateJoined: DateTime!
  }

  input UpdateResidentDTO {
    firstName: String
    lastName: String
    email: String
    phoneNumber: String
    displayName: String
    profilePictureLink: String
    birthdate: Date
    credits: Float
    dateJoined: DateTime
    dateLeft: DateTime
  }

  enum RedeemCreditResponse {
    SUCCESS
    NOT_ENOUGH_CREDITS
    INVALID_ID
  }

  extend type Query {
    residentsById(id: [ID!]): [ResidentDTO!]
    allResidents: [ResidentDTO!]
  }

  extend type Mutation {
    updateResident(id: ID!, resident: UpdateResidentDTO!): ResidentDTO!
    addResident(resident: CreateResidentDTO!): ResidentDTO!
    deleteResident(id: ID!): ResidentDTO!
    redeemCredits(id: ID!, credits: Float!): RedeemCreditResponse!
  }
`;

export default residentType;
