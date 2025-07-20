import { gql } from "apollo-server-express";

const enums = gql`
  enum TaskType {
    REQUIRED
    OPTIONAL
    INDIVIDUAL_GOAL
  }
    
  enum TransactionType {
    EARNING
    PURCHASE
    REFUND
  }
    
  enum BadgeType {
    SYSTEM
    CUSTOM
  }
    
  enum RecurrenceFrequency {
    DAILY
    EVERY_SELECTED_DAYS
    ANY_SELECTED_DAYS
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
    
  enum TimeOption {
    ANYTIME
    SPECIFIC
    PARTICIPANT_PREFERENCE
  }
    
  enum Priority {
    NORMAL
    HIGH
    CRITICAL
  }
    
  enum Status {
    ASSIGNED
    INCOMPLETE
    COMPLETE
    EXCUSED
  }


enum AnnouncementFilter {
      ALL
      UNREAD
      PINNED
      IMPORTANT
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
