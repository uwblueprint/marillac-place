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
`;

export default customTypes;
