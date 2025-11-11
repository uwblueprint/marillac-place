import { gql } from "apollo-server-express";

const responses = gql`
  type LoginResponse {
    token: String!
  }

  type CalendarEvent {
    id: Int!
    title: String!
    start: String!
    end: String!
    allDay: Boolean!
    task_status: Status!
    task_type: TaskType!
    marillacBucksAddition: Int!
    marillac_bucks_deduction: Int!
    comment: String
  }

  type GetAssignedTaskResponse {
    SPECIFIC: [CalendarEvent!]!
    ANYTIME: [CalendarEvent!]!
    ANYDAY: [CalendarEvent!]!
  }
`;

export default responses;
