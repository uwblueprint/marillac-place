import { gql } from "apollo-server-express";

const taskType = gql`
  enum Status {
    PENDING_APPROVAL
    ASSIGNED
    INCOMPLETE
    COMPLETE
    EXCUSED
  }

  enum Recurrence_Frequency {
    DAILY
    WEEKLY
    BI_WEEKLY
  }

  enum TaskType {
    REQUIRED
    OPTIONAL
    CHORE
    CUSTOM
  }

  type TaskDTO {
    id: Int!
    type: TaskType!
    title: String!
    description: String!
    creditValue: Int!
    location: TaskLocationDTO!
    tasksAssigned: [TaskAssignedDTO!]
  }

  input InputTaskDTO {
    type: TaskType!
    title: String!
    description: String!
    creditValue: Int!
    locationId: Int!
  }

  input InputTaskAssignedDTO {
    taskId: Int
    assigneeId: Int
    assignerId: Int
    status: Status
    startDate: Date
    endDate: Date
    recurrenceFrequency: Recurrence_Frequency
    comments: String
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

  type TaskLocationDTO {
    id: Int!
    title: String!
    description: String!
  }

  extend type Query {
    getTaskById(taskId: Int!): TaskDTO!
    getTasksByType(type: TaskType!): [TaskDTO!]
    getTasksByAssigneeId(assigneeId: Int!): [TaskAssignedDTO]
    getTasksByAssignerId(assignerId: Int!): [TaskAssignedDTO]
    getTasksByStartDate(startDate: Date!): [TaskAssignedDTO]
    getTasksByEndDate(endDate: Date!): [TaskAssignedDTO]
    getTasksByStatus(status: Status!): [TaskAssignedDTO]
  }

  extend type Mutation {
    createTask(task: InputTaskDTO!): TaskDTO!
    updateTask(taskId: Int, task: InputTaskDTO!): TaskDTO!
    deleteTask(taskId: Int): TaskDTO!
    assignTask(taskAssigned: InputTaskAssignedDTO): TaskAssignedDTO
    changeTaskStatus(taskAssignedId: Int!, status: Status!): TaskAssignedDTO
  }
`;

export default taskType;
