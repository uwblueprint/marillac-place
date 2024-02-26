import { gql } from "apollo-server-express";

const staffType = gql`
  type StaffDTO {
    userId: ID!
    isAdmin: Boolean!
    type: UserTypes!
    email: String!
    firstName: String!
    lastName: String!
    phoneNumber: String
    displayName: String
    profilePictureLink: String
    isActive: Boolean!
  }

  # input CreateStaffDTO {
  #   roleId: Int!
  #   firstName: String!
  #   lastName: String!
  #   email: String!
  #   phoneNumber: String
  #   displayName: String!
  #   profilePictureLink: String
  # }
  # input UpdateStaffDTO {
  #   roleId: Int!
  #   firstName: String!
  #   lastName: String!
  #   email: String!
  #   phoneNumber: String
  #   displayName: String!
  #   profilePictureLink: String
  # }
  extend type Query {
    getStaffById(staffIds: [ID!]): [StaffDTO!]
    getAllStaff: [StaffDTO!]
  }

  extend type Mutation {
    updateStaff(staffId: ID!, userInfo: UpdateUserDTO!, isAdmin: Boolean!): StaffDTO!
    addStaff(userInfo: CreateUserDTO!, isAdmin: Boolean!): StaffDTO!
    deleteStaff(staffId: ID!): StaffDTO!
  }
`;

export default staffType;
