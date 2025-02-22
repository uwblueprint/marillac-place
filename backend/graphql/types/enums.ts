import { gql } from "apollo-server-express";

const customTypes = gql`
  enum StaffType {
    ADMIN
    RELIEF
  }

  enum TaskType {
    REQUIRED
    OPTIONAL
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
`;

export default customTypes;
