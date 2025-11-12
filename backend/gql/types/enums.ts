import { gql } from "apollo-server-express";

const enums = gql`
  enum DayOfWeek {
    SUNDAY
    MONDAY
    TUESDAY
    WEDNESDAY
    THURSDAY
    FRIDAY
    SATURDAY
  }

  enum DayPreference {
    DAILY
    DAY_RANGE
    EVERY_SELECTED_DAYS
    PARTICIPANT_PREFERENCE
  }

  enum GoalAction {
    REACHED
    SET
  }

  enum Icon {
    BABY
    DIAMOND
    FIVE_STAR
    FLOWER
    FOUR_STAR
    GEMSTONE
    GROUP
    HEART
    HOME
    MONEY
    PENCIL
    TOOL
    WINGS
  }

  enum Level {
    NOVICE
    BRONZE
    SILVER
    GOLD
    DIAMOND
  }

  enum Priority {
    NORMAL
    HIGH
    CRITICAL
  }

  enum TaskStatus {
    ASSIGNED
    COMPLETE
    EXCUSED
    INCOMPLETE
  }

  enum TaskType {
    INDIVIDUAL_GOAL
    OPTIONAL
    REQUIRED
  }

  enum TimePreference {
    ANYTIME
    PARTICIPANT_PREFERENCE
    SPECIFIC
  }

  enum TransactionType {
    EARNING
    PURCHASE
    REFUND
  }
`;

export default enums;
