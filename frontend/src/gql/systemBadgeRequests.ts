import { gql } from "@apollo/client";

export const GET_SYSTEM_BADGES = gql`
  query getSystemBadges {
    getSystemBadges {
      name
      icon
      description
      is_active
      BadgeLevel {
        name
        level
        value
        benchmark
      }
    }
  }
`;

export const UPDATE_SYSTEM_BADGE = gql`
  mutation updateSystemBadge(
    $name: String!
    $description: String
    $isActive: Boolean
  ) {
    updateSystemBadge(
      name: $name
      description: $description
      is_active: $isActive
    ) {
      name
      icon
      description
      is_active
    }
  }
`;
