import { gql } from "@apollo/client";

export const GET_BADGE_LEVEL_PROGRESS = gql`
  query getBadgeLevelProgress($pid: Int!) {
    getBadgeLevelProgress(pid: $pid) {
      name
      level
      pid
      progress
      badge_level {
        value
        benchmark
        system_badge {
          name
          icon
          description
          is_active
        }
      }
    }
  }
`;
