import { gql } from "apollo-server-express";

const staffType = gql`
  type StaffDTO {
    id: ID!
    roleId: Float!
    firstName: String!
    lastName: String!
    email: String!
    phoneNumber: String
    displayName: String!
    profilePictureLink: String
  }
  input CreateStaffDTO {
    roleId: Float!
    firstName: String!
    lastName: String!
    email: String!
    phoneNumber: String
    displayName: String!
    profilePictureLink: String
  }
  input UpdateStaffDTO {
    roleId: Float!
    firstName: String!
    lastName: String!
    email: String!
    phoneNumber: String
    displayName: String!
    profilePictureLink: String
  }
  extend type Query {
    getStaffById(id: [ID!]): [StaffDTO!]
    getAllStaff: [StaffDTO!]
  }

  extend type Mutation {
    updateStaff(id: ID!, staff: UpdateStaffDTO!): StaffDTO!
    addStaff(staff: CreateStaffDTO!): StaffDTO!
    deleteStaff(id: ID!): StaffDTO!
  }
`;

export default staffType;
