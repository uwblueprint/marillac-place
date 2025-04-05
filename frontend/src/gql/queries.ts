import { gql } from "@apollo/client";

export const GET_AVAILABLE_ROOMS = gql`
  query getAvailableRooms {
    getAvailableRooms
  }
`;

export const GET_PAST_PARTICIPANTS = gql`
  query getPastParticipants {
    getPastParticipants {
      participantId
      arrival
      departure
    }
  }
`;

export const GET_CURRENT_PARTICIPANTS = gql`
  query getCurrentParticipants {
    getCurrentParticipants {
      participantId
      roomNumber
      arrival
      password
    }
  }
`;

export const GET_PARTICIPANT_BY_ID = gql`
  query getParticipantById($participantId: String!) {
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

export const GET_NOTES = gql`
  query getNotes {
    getNotes {
      noteId
      message
      date
    }
  }
`;

