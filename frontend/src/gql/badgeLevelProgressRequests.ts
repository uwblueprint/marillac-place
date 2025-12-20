import { gql } from "@apollo/client";

export const GET_BADGE_LEVEL_PROGRESS = gql`
  getBadgeLevelProgress(pid: $pid) {
    name
    level
    pid
    progress
    badge_level {
      value
      benchmark
      system_badge {
        icon
        description
        is_active
      }
    }
  }
`;
