import { gql } from "graphql-tag";

const residentType = gql`
  type ResidentDTO {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    phoneNumber: String
    displayName: String
    profilePictureLink: String
    birthdate: DateTime
    credits: Float
    dateJoined: DateTime
    dateLeft: DateTime
    tasks: [Task]
    warnings: [Warning]
  }

  input CreateResidentDTO {
    firstName: String!
    lastName: String!
    email: String!
    phoneNumber: String
    displayName: String
    profilePictureLink: String
    birthdate: DateTime
    credits: Float
    dateJoined: DateTime
  }

  input UpdateResidentDTO {
    firstName: String
    lastName: String
    email: String
    phoneNumber: String
    displayName: String
    profilePictureLink: String
    birthdate: DateTime
    credits: Float
    dateJoined: DateTime
    dateLeft: DateTime
  }

  extend type Query {
    residentById(id: ID!): ResidentDTO!
    residentByName(name: String!): ResidentDTO!
    residentByEmail(email: String!): ResidentDTO!
  }

  extend type Mutation {
    createResident(input: CreateResidentDTO!): ResidentDTO!
    updateResident(id: ID!, input: UpdateResidentDTO!): ResidentDTO!
    deleteResident(id: ID!): ID
  }
`;

export default residentType;