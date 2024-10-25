import { gql } from "@apollo/client";

export const GET_ALL_STAFF = gql`
  query GetAllStaff {
    getAllStaff {
      userId
      email
      phoneNumber
      firstName
      lastName
      displayName
      profilePictureURL
      isActive
      isAdmin
    }
  }
`;

export const GET_STAFF_BY_IDS = gql`
  query GetStaffByIds {
    getStaffByIds {
      userId
      email
      phoneNumber
      firstName
      lastName
      displayName
      profilePictureURL
      isActive
      isAdmin
    }
  }
`;
