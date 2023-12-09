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
    status: Status!
    description: String!
    assigneeId: Int!
    assignerId: Int!
    creditValue: Float!
    startDate: Date!
    endDate: Date
    comments: String
    recurrenceFrequency: Recurrence_Frequency
  }

  type TaskDTO {
    id: Int!
    categoryName: String!
    categoryId: Int!
    title: String!
    status: Status!
    description: String!
    assigneeId: Int!
    assigneeName: String!
    assignerId: Int!
    assignerName: String!
    creditValue: Float!
    startDate: Date!
    endDate: Date
    comments: String
    recurrenceFrequency: Recurrence_Frequency
  }

  extend type Query {
    getTaskById(id: Int!): TaskDTO!
    getTasksByCategoryId(categoryId: Int!): [TaskDTO!]
    getTasksByAssigneeId(assigneeId: Int!): [TaskDTO!]
    getTasksByAssignerId(assignerId: Int!): [TaskDTO!]
    getTasksByStartDate(startDate: Date!): [TaskDTO!]
    getTasksByStatus(status: Status!): [TaskDTO!]
  }

  extend type Mutation {
    createTask(task: InputTaskDTO!): TaskDTO!
    updateTask(id: Int!, task: InputTaskDTO!): TaskDTO!
    deleteTask(id: Int!): TaskDTO!
  }
`;

export default taskType;
