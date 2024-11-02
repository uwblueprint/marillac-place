import { gql } from "@apollo/client";

export const GET_RESIDENTS_BY_ID = gql`
  query GetResidentsByIds($userIds: [ID!]) {
    getResidentsByIds(userIds: $userIds) {
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

export const GET_ALL_RESIDENTS = gql`
  query GetAllResidents {
    getAllResidents {
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

export const GET_ACTIVE_RESIDENTS = gql`
  query GetActiveResidents {
    getActiveResidents {
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
