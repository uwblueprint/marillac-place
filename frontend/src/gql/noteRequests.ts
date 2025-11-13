import { gql } from "@apollo/client";

export const GET_NOTES = gql`
  query getNotes {
    getNotes {
      nid
      message
      date
    }
  }
`;

export const CREATE_NOTE = gql`
  mutation createNote($message: String!) {
    createNote(message: $message) {
      nid
      message
      date
    }
  }
`;

export const DELETE_NOTE = gql`
  mutation deleteNote($nid: Int!) {
    deleteNote(nid: $nid) {
      nid
      message
      date
    }
  }
`;
