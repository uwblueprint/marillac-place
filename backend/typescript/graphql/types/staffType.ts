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
    profilePictureURL: String
    isActive: Boolean!
  }

  extend type Query {
    getAllStaff: [StaffDTO!]
    getStaffByIds(staffIds: [ID!]): [StaffDTO!]
  }

  extend type Mutation {
    addStaff(userInfo: CreateUserDTO!, isAdmin: Boolean): StaffDTO!
    updateStaff(
      staffId: ID!
      userInfo: UpdateUserDTO!
      isAdmin: Boolean
    ): StaffDTO!
    deleteStaff(staffId: ID!): StaffDTO!
  }
`;

export default staffType;
