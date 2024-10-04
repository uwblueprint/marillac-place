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
    ONE_TIME
    REPEATS_PER_WEEK_SELECTED
    REPEATS_PER_WEEK_ONCE
  }

  enum DaysOfWeek {
    MONDAY
    TUESDAY
    WEDNESDAY
    THURSDAY
    FRIDA
    SATURDAY
    SUNDAY
  }

  enum TaskType {
    REQUIRED
    OPTIONAL
    CHORE
    ACHIEVEMENT
  }

  type TaskDTO {
    id: Int!
    type: TaskType!
    title: String!
    description: String!
    creditValue: Int!
    location: TaskLocationDTO!
    tasksAssigned: [TaskAssignedDTO!]
    endDate: DateTime
    recurrenceFrequency: Recurrence_Frequency!
    specificDay: DaysOfWeek
    repeatDays: [DaysOfWeek!]
  }

  type TaskLocationDTO {
    id: Int!
    title: String!
    description: String!
  }

  input InputTaskDTO {
    type: TaskType!
    title: String!
    description: String!
    creditValue: Int!
    locationId: Int!
    endDate: DateTime
    recurrenceFrequency: Recurrence_Frequency!
    specificDay: DaysOfWeek
    repeatDays: [DaysOfWeek!]
  }

  input InputTaskAssignedDTO {
    taskId: Int
    assigneeId: Int
    assignerId: Int
    status: Status
    startDate: DateTime
    comments: String
  }

  type TaskAssignedDTO {
    id: Int!
    taskId: Int!
    assigneeId: Int!
    assignerId: Int!
    status: Status!
    startDate: DateTime!
    comments: String
  }

  extend type Query {
    getTaskById(taskId: Int!): TaskDTO!
    getTasksByType(type: TaskType!): [TaskDTO!]
    getTasksByAssigneeId(assigneeId: Int!): [TaskAssignedDTO]
    getTasksByAssignerId(assignerId: Int!): [TaskAssignedDTO]
    getTasksByStartDate(startDate: DateTime!): [TaskAssignedDTO]
    # getTasksByEndDate(endDate: DateTime!): [TaskAssignedDTO]
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
