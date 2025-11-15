import { gql } from "@apollo/client";

export const GET_CURRENT_PARTICIPANTS = gql`
  query getCurrentParticipants {
    getCurrentParticipants {
      pid
      room
      arrival
      departure
      password
      balance
      total_earnings
    }
  }
`;

export const GET_PAST_PARTICIPANTS = gql`
  query getPastParticipants {
    getPastParticipants {
      pid
      room
      arrival
      departure
      password
      balance
      total_earnings
    }
  }
`;

export const GET_PARTICIPANT_BY_PID = gql`
  query getParticipantByPid($pid: Int!) {
    getParticipantByPid(pid: $pid) {
      pid
      room
      balance
      total_earnings
      arrival
      departure
    }
  }
`;

export const CREATE_PARTICIPANT = gql`
  mutation createParticipant(
    $pid: Int!
    $password: String!
    $room: Int!
    $arrival: Date!
  ) {
    createParticipant(
      pid: $pid
      password: $password
      room: $room
      arrival: $arrival
    ) {
      pid
      room
      arrival
      departure
      password
      balance
      total_earnings
    }
  }
`;

export const UPDATE_PARTICIPANT = gql`
  mutation updateParticipant(
    $pid: Int!
    $password: String
    $room: Int
    $arrival: Date
    $departure: Date
  ) {
    updateParticipant(
      pid: $pid
      password: $password
      room: $room
      arrival: $arrival
      departure: $departure
    ) {
      pid
      room
      arrival
      departure
      password
      balance
      total_earnings
    }
  }
`;
