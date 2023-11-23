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
    notifications: [NotificationDTO!]
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

  extend type Query {
    residentsById(id: [ID!]): [ResidentDTO!]
    allResidents: [ResidentDTO!]
    activeResidents: [ResidentDTO!]
  }

  extend type Mutation {
    updateResident(id: ID!, resident: UpdateResidentDTO!): ResidentDTO!
    addResident(resident: CreateResidentDTO!): ResidentDTO!
    deleteResident(id: ID!): ResidentDTO!
  }
`;

export default residentType;
