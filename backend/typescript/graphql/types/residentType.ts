import { gql } from "apollo-server-express";

// TODO: Look into custom types for dates and date time types

const residentType = gql`
  type ResidentDTO {
    userId: Int!
    residentId: Int!
    birthDate: Date!
    roomNumber: Int!
    credits: Float!
    dateJoined: DateTime!
    dateLeft: DateTime
    notes: String
    email: String!
    phoneNumber: String
    firstName: String!
    lastName: String!
    displayName: String
    profilePictureURL: String
    isActive: Boolean!
  }

  input CreateResidentDTO {
    residentId: Int!
    birthDate: Date!
    roomNumber: Int!
    credits: Float!
    dateJoined: DateTime!
    dateLeft: DateTime
    notes: String
  }

  input UpdateResidentDTO {
    residentId: Int!
    birthDate: Date!
    roomNumber: Int!
    credits: Float!
    dateJoined: DateTime!
    dateLeft: DateTime
    notes: String
  }

  enum RedeemCreditResponse {
    SUCCESS
    NOT_ENOUGH_CREDITS
    INVALID_ID
  }

  extend type Query {
    residentsById(id: [ID!]): [ResidentDTO!]
    allResidents: [ResidentDTO!]
    activeResidents: [ResidentDTO!]
  }

  extend type Mutation {
    updateResident(
      residentId: ID!
      userInfo: UpdateUserDTO!
      resident: UpdateResidentDTO!
    ): ResidentDTO!
    addResident(
      userInfo: CreateUserDTO!
      resident: CreateResidentDTO!
    ): ResidentDTO!
    deleteResident(id: ID!): ResidentDTO!
    redeemCredits(id: ID!, credits: Float!): RedeemCreditResponse!
  }
`;

export default residentType;
