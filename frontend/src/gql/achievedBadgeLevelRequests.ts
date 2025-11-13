import { gql } from "@apollo/client";

export const GET_ACHIEVED_BADGE_LEVELS = gql`
  query getAchievedBadgeLevels($pid: Int!) {
    getAchievedBadgeLevels(pid: $pid) {
      name
      level
      pid
      notified
      date
      badge_level {
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

export const FETCH_NEW_ACHIEVED_BADGE_LEVELS = gql`
  mutation fetchNewAchievedBadgeLevels($pid: Int!) {
    fetchNewAchievedBadgeLevels(pid: $pid) {
      name
      level
      pid
      notified
      date
      badge_level {
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
