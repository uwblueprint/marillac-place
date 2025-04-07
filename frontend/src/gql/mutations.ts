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
    $roomNumber: Int
    $arrival: String
    $departure: String
    $password: String
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

export const CREATE_NOTE = gql`
  mutation createNote(
    $message: String!
    $date: String!
    $formattedDate: String!
  ) {
    createNote(message: $message, date: $date, formattedDate: $formattedDate)
  }
`;

export const DELETE_NOTE = gql`
  mutation deleteNote($noteId: Int!) {
    deleteNote(noteId: $noteId)
  }
`;
