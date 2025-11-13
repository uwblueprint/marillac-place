import { gql } from "@apollo/client";

export const ADMIN_LOGIN = gql`
  mutation adminLogin($role: String!, $password: String!) {
    adminLogin(role: $role, password: $password) {
      token
    }
  }
`;

export const PARTICIPANT_LOGIN = gql`
  mutation participantLogin($id: Int!, $password: String!) {
    participantLogin(pid: $id, password: $password) {
      token
      participant {
        pid
        room
        arrival
        departure
        balance
        total_earnings
      }
    }
  }
`;
