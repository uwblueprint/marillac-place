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

  type TaskDTO {
    id: Int!
    categoryId: Int!
    title: String!
    description: String!
    creditValue: Float!
    recurrenceFrequency?: Recurrence_Frequency
    tasksAssigned?: [TaskAssignedDTO!]
  }
  
  type TaskAssignedDTO {
    id: Int!
    taskId: Int!
    status: Status!
    assigneeId: Int!
    assignerId: Int!
    startDate: Date!
    endDate: Date
  }

  extend type Query {
    getTaskById(id: Int!): TaskDTO!
    getTasksByCategoryId(categoryId: Int!): [TaskDTO!]
    getTasksByAssigneeId(assigneeId: Int!): [TaskDTO!]
    getTasksByAssignerId(assignerId: Int!): [TaskDTO!]
    getTasksByStartDate(startDate: Date!): [TaskDTO!]
    getTasksByEndDate(endDate: Date!): [TaskDTO!]
    getTasksByStatus(status: Status!): [TaskDTO!]
  }

  extend type Mutation {
    createTask(task: TaskDTO!): TaskDTO!
    updateTask(id: Int!, task: InputTaskDTO!): TaskDTO!
    deleteTask(id: Int!): TaskDTO!
  }
`;

export default taskType;
