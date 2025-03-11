import { gql } from "apollo-server-express";

const dataModels = gql`
  type Participant {
    participantId: String!
    roomNumber: Int!
    arrival: String!
    departure: String
    password: String!
    credit: Int!
  }

  type Announcement {
    announcementId: Int!
    from: StaffType!
    to: [Int!]!
    createdAt: DateTime!
    message: String!
  }

  type Task {
    taskId: Int!
    type: TaskType!
    name: String!
    recurrencePreference: RecurrenceFrequency!
    repeatDays: [DaysOfWeek!]!
    timePreference: TimeOption!
    credit: Int!
    deduction: Int!
    start: String
    end: String
    comment: String
  }
`;

export default dataModels;
