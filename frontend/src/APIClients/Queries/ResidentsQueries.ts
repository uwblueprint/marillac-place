import { gql } from "@apollo/client";

export const GET_RESIDENTS_BY_ID = gql`
  query GetResidentsByIds($userIds: [ID!]) {
    getResidentsByIds(userIds: $userIds) {
      userId
      residentId
      roomNumber
      credits
      dateJoined
      dateLeft
    }
  }
`;

export const GET_ALL_RESIDENTS = gql`
  query GetAllResidents {
    getAllResidents {
      userId
      residentId
      roomNumber
      credits
      dateJoined
      dateLeft
    }
  }
`;

export const GET_ACTIVE_RESIDENTS = gql`
  query GetActiveResidents {
    getActiveResidents {
      userId
      residentId
      roomNumber
      credits
      dateJoined
      dateLeft
    }
  }
`;
