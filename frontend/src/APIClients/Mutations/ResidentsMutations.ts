import { gql } from "@apollo/client";

export const ADD_RESIDENT = gql`
  mutation AddResident($resident: CreateResidentDTO!) {
    addResident(resident: $resident) {
      userId
      residentId
      displayName
      profilePictureURL
      roomNumber
      credits
      dateJoined
      dateLeft
    }
  }
`;

export const UPDATE_RESIDENT = gql`
  mutation UpdateResident($userId: ID!, $resident: UpdateResidentDTO!) {
    updateResident(userId: $userId, resident: $resident) {
      userId
      residentId
      displayName
      profilePictureURL
      roomNumber
      credits
      dateJoined
      dateLeft
    }
  }
`;

export const DELETE_RESIDENT = gql`
  mutation DeleteResident($userId: ID!) {
    deleteResident(userId: $userId) {
      userId
      residentId
      displayName
      profilePictureURL
      roomNumber
      credits
      dateJoined
      dateLeft
    }
  }
`;
