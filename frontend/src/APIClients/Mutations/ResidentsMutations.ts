import { gql } from "@apollo/client";

export const ADD_RESIDENT = gql`
  mutation AddResident($resident: CreateResidentDTO!) {
    addResident(resident: $resident) {
      userId
      residentId
      email
      phoneNumber
      firstName
      lastName
      displayName
      profilePictureURL
      isActive
      birthDate
      roomNumber
      credits
      dateJoined
      dateLeft
      notes
    }
  }
`;

export const UPDATE_RESIDENT = gql`
  mutation UpdateResident($userId: ID!, $resident: UpdateResidentDTO!) {
    updateResident(userId: $userId, resident: $resident) {
      userId
      residentId
      email
      phoneNumber
      firstName
      lastName
      displayName
      profilePictureURL
      isActive
      birthDate
      roomNumber
      credits
      dateJoined
      dateLeft
      notes
    }
  }
`;

export const DELETE_RESIDENT = gql`
  mutation DeleteResident($userId: ID!) {
    deleteResident(userId: $userId) {
      userId
      residentId
      email
      phoneNumber
      firstName
      lastName
      displayName
      profilePictureURL
      isActive
      birthDate
      roomNumber
      credits
      dateJoined
      dateLeft
      notes
    }
  }
`;
