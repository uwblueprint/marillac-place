import { gql } from "@apollo/client";

export const ADMIN_LOGIN = gql`
  mutation adminLogin($role: String!, $password: String!) {
    adminLogin(role: $role, password: $password) {
      token
    }
  }
`;

export const PARTICIPANT_LOGIN = gql`
  mutation participantLogin($pid: Int!, $password: String!) {
    participantLogin(pid: $pid, password: $password) {
      token
      pid
    }
  }
`;
