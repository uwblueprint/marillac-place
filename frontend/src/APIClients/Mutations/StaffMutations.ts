import { gql } from "@apollo/client";

export const ADD_STAFF = gql`
  mutation AddStaff($staff: CreateStaffDTO!) {
    addStaff(staff: $staff) {
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

export const UPDATE_STAFF = gql`
  mutation UpdateStaff($userId: userID!, $staff: UpdateStaffDTO!) {
    updateStaff(userId: $userId, staff: $staff) {
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

export const DELETE_STAFF = gql`
  mutation DeleteStaff($userId: ID!) {
    deleteStaff(userId: $userId) {
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
