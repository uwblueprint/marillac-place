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
    title: String
    status: Status
    description: String
    assigneeId: Int!
    assignerId: Int!
    creditValue: Int
    startDate: DateTime!
    endDate: DateTime
    comments: String
    recurrenceFrequency: Recurrence_Frequency
  }

  type TaskDTO {
    id: Int!
    category: String!
    categoryId: Int!
    title: String
    status: Status
    description: String
    assigneeId: Int!
    assignee: String!
    assignerId: Int!
    assigner: String!
    creditValue: Int
    startDate: DateTime!
    endDate: DateTime
    comments: String
    recurrenceFrequency: Recurrence_Frequency
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
