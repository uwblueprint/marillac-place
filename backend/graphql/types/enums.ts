import { gql } from "apollo-server-express";

const customTypes = gql`
  enum StaffType {
    ADMIN
    RELIEF
  }

  enum TaskType {
    REQUIRED
    OPTIONAL
    CUSTOM
  }

  enum PriorityType {
    LOW
    MEDIUM
    HIGH
  }

  enum TaskStatus {
    UNASSIGNED
    ASSIGNED
    INCOMPLETE
    PENDING
    COMPLETE
    EXCUSED
  }

  enum DaysOfWeek {
    MONDAY
    TUESDAY
    WEDNESDAY
    THURSDAY
    FRIDAY
    SATURDAY
    SUNDAY
  }

  enum RecurrenceFrequency {
    DAILY
    EVERY_SELECTED_DAYS
    ANY_SELECTED_DAYS
  }

  enum TimeOption {
    ANYTIME
    SPECIFIC
  }

`;

export default customTypes;
