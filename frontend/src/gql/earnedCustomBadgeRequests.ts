import { gql } from "@apollo/client";

export const GET_EARNED_CUSTOM_BADGES = gql`
  query getEarnedCustomBadges($pid: Int!) {
    getEarnedCustomBadges(pid: $pid) {
      eid
      pid
      name
      icon
      description
      notified
    }
  }
`;

export const FETCH_NEW_EARNED_CUSTOM_BADGES = gql`
  mutation fetchNewEarnedCustomBadges($pid: Int!) {
    fetchNewEarnedCustomBadges(pid: $pid) {
      eid
      pid
      name
      icon
      description
      notified
    }
  }
`;

export const CREATE_EARNED_CUSTOM_BADGE = gql`
  mutation createEarnedCustomBadge(
    $pid: Int!
    $name: String!
    $icon: Icon!
    $description: String!
  ) {
    createEarnedCustomBadge(
      pid: $pid
      name: $name
      icon: $icon
      description: $description
    ) {
      eid
      pid
      name
      icon
      description
      notified
    }
  }
`;
