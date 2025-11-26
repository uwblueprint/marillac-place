import { gql } from "@apollo/client";

export const GET_CUSTOM_BADGES = gql`
  query getCustomBadges {
    getCustomBadges {
      cid
      name
      description
      icon
    }
  }
`;

export const CREATE_CUSTOM_BADGE = gql`
  mutation createCustomBadge(
    $name: String!
    $description: String!
    $icon: Icon!
  ) {
    createCustomBadge(name: $name, description: $description, icon: $icon) {
      cid
      name
      description
      icon
    }
  }
`;

export const UPDATE_CUSTOM_BADGE = gql`
  mutation updateCustomBadge(
    $cid: Int!
    $name: String
    $description: String
    $icon: Icon
  ) {
    updateCustomBadge(
      cid: $cid
      name: $name
      description: $description
      icon: $icon
    ) {
      cid
      name
      description
      icon
    }
  }
`;

export const DELETE_CUSTOM_BADGE = gql`
  mutation deleteCustomBadge($cid: Int!) {
    deleteCustomBadge(cid: $cid) {
      cid
      name
      description
      icon
    }
  }
`;
