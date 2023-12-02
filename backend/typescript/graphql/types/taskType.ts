import { gql } from "apollo-server-express";

const taskType = gql`
  enum Status {
    PENDING_APPROVAL
    INCOMPLETE
    COMPLETE
    EXCUSED
  }

  enum RecurrenceFrequency {
    DAILY
    WEEKLY
    BI_WEEKLY
  }

  input InputTaskDTO {
    categoryId: Int!
    title: String
    status: Status
    description: String
    assigneeId: Int!
    assignerId: Int!
    creditValue: Int
    startDate: DateTime!
    endDate: DateTime
    comments: String
    recurrenceFrequency: RecurrenceFrequency
  }

  type TaskDTO {
    id: Int!
    categoryName: String!
    categoryId: Int!
    title: String
    status: Status
    description: String
    assigneeId: Int!
    assigneeName: String!
    assignerId: Int!
    assignerName: String!
    creditValue: Int
    startDate: DateTime!
    endDate: DateTime
    comments: String
    recurrenceFrequency: RecurrenceFrequency
  }

  extend type Query {
    getTaskById(id: Int!): TaskDTO!
    getTasksByCategoryId(categoryId: Int!): [TaskDTO!]
    getTasksByAssigneeId(assigneeId: Int!): [TaskDTO!]
    getTasksByAssignerId(assignerId: Int!): [TaskDTO!]
  }

  extend type Mutation {
    createTask(task: InputTaskDTO!): TaskDTO!
    updateTask(id: Int!, task: InputTaskDTO!): TaskDTO!
    deleteTask(id: Int!): TaskDTO!
  }
`;

export default taskType;