import {gql} from "@apollo/client";

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
