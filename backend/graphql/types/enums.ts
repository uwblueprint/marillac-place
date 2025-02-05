import { gql } from "apollo-server-express";

const customTypes = gql`
  enum StaffType {
    ADMIN
    RELIEF
  }

  enum TaskType {
    REQUIRED
    OPTIONAL
    CHORE
  }

  enum TaskStatus {
    UNASSIGNED
    ASSIGNED
    INCOMPLETE
    COMPLETE
    EXCUSED
  }
`;

export default customTypes;
