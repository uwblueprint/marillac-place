import { gql } from "apollo-server-express";

const staffType = gql`
  type StaffDTO {
    userId: ID!
    email: String!
    phoneNumber: String
    firstName: String!
    lastName: String!
    displayName: String
    profilePictureURL: String
    isActive: Boolean!
    isAdmin: Boolean!
  }

  input CreateStaffDTO {
    email: String!
    password: String!
    phoneNumber: String
    firstName: String!
    lastName: String!
    displayName: String
    profilePictureURL: String
    isAdmin: Boolean!
  }

  input UpdateStaffDTO {
    email: String
    password: String
    phoneNumber: String
    firstName: String
    lastName: String
    displayName: String
    profilePictureURL: String
    isActive: Boolean
    isAdmin: Boolean
  }

  extend type Query {
    getStaffByIds(userIds: [ID!]): [StaffDTO!]
    getAllStaff: [StaffDTO!]
  }

  extend type Mutation {
    addStaff(staff: CreateStaffDTO!): StaffDTO!
    updateStaff(userId: ID!, staff: UpdateStaffDTO!): StaffDTO!
    deleteStaff(userId: ID!): StaffDTO!
  }
`;

export default staffType;
