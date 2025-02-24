import { gql } from "@apollo/client";

export const CREATE_PARTICIPANT = gql`
  mutation createParticipant(
    $participantId: String!
    $roomNumber: Int!
    $arrival: String!
    $password: String!
  ) {
    createParticipant(
      participantId: $participantId
      roomNumber: $roomNumber
      arrival: $arrival
      password: $password
    )
  }
`;

export const UPDATE_PARTICIPANT_BY_ID = gql`
  mutation updateParticipantById(
    $participantId: String!
    $roomNumber: Int!
    $arrival: String!
    $departure: String!
    $password: String!
  ) {
    updateParticipantById(
      participantId: $participantId
      roomNumber: $roomNumber
      arrival: $arrival
      departure: $departure
      password: $password
    )
  }
`;
