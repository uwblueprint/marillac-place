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

  enum TaskStatus {
    UNASSIGNED
    ASSIGNED
    INCOMPLETE
    PENDING
    COMPLETE
    EXCUSED
  }

  enum TimeOption{
    ANYTIME
    SPECIFIC
  }
  
  enum RecurrenceFrequency{
    DAILY
    EVERY_SELECTED_DAYS
    ANY_SELECTED_DAYS
  }
    
`;

export default customTypes;
