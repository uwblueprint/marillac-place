import { gql } from "apollo-server-express";

const enums = gql`
  enum TransactionType {
    EARNING
    PURCHASE
    REFUND
  }

  enum GoalAction {
    SET
    REACHED
  }

  enum Priority {
    NORMAL
    HIGH
    CRITICAL
  }

  enum TaskType {
    REQUIRED
    OPTIONAL
    INDIVIDUAL_GOAL
  }

  enum TaskStatus {
    ASSIGNED
    INCOMPLETE
    COMPLETE
    EXCUSED
  }

  enum DayPreference {
    DAILY
    EVERY_SELECTED_DAYS
    DAY_RANGE
    PARTICIPANT_PREFERENCE
  }

  enum DayOfWeek {
    MONDAY
    TUESDAY
    WEDNESDAY
    THURSDAY
    FRIDAY
    SATURDAY
    SUNDAY
  }

  enum TimePreference {
    ANYTIME
    SPECIFIC
    PARTICIPANT_PREFERENCE
  }

  enum Level {
    NOVICE
    BRONZE
    SILVER
    GOLD
    DIAMOND
  }

  enum Icon {
    FIVE_STAR
    FOUR_STAR
    GROUP
    HEART
    HOME
    BABY
    WINGS
    FLOWER
    MONEY
    GEMSTONE
    DIAMOND
    PENCIL
    TOOL
  }
`;

export default enums;
