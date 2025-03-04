import { gql } from "@apollo/client";

export const GET_AVAILABLE_ROOMS = gql`
  query getAvailableRooms {
    getAvailableRooms
  }
`;

export const GET_ALL_PARTICIPANTS = gql`
  query getAllParticipants {
    getAllParticipants {
      participantId
      roomNumber
      arrival
      departure
      password
      credit
    }
  }
`;

export const GET_PARTICIPANT_BY_ID = gql`
  query getParticipantById($participantId: String) {
    getParticipantById(participantId: $participantId) {
      participantId
      roomNumber
      arrival
      departure
      password
      credit
    }
  }
`;



