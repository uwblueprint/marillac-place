import { gql } from "apollo-server-express";

const taskType = gql`
  enum Status {
    PENDING_APPROVAL
    INCOMPLETE
    COMPLETE
    EXCUSED
  }

  enum Recurrence_Frequency {
    DAILY
    WEEKLY
    BI_WEEKLY
  }

  input InputTaskDTO {
    categoryId: Int!
    title: String!
    status: Status
    description: String!
    assigneeId: Int!
    assignerId: Int!
    creditValue: Int!
    startDate: String!
    endDate: String
    comments: String!
    recurrenceFrequency: Recurrence_Frequency!
  }

  type TaskDTO {
    id: Int!
    category: String!
    categoryId: Int!
    title: String!
    status: Status!
    description: String!
    assigneeId: Int!
    assignee: String!
    assignerId: Int!
    assigner: String!
    creditValue: Int!
    startDate: String!
    endDate: String
    comments: String!
    recurrenceFrequency: Recurrence_Frequency!
  }
`;

export default taskType;
