import { gql } from "@apollo/client";

export const UPDATE_BADGE_LEVEL = gql`
  mutation updateBadgeLevel(
    $name: String!
    $level: Level!
    $benchmark: Int
    $value: Int
  ) {
    updateBadgeLevel(
      name: $name
      level: $level
      benchmark: $benchmark
      value: $value
    ) {
      name
      level
      value
      benchmark
    }
  }
`;
