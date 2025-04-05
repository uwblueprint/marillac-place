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
    createdAt: String!
    message: String!
  }

  type Task {
    taskId: Int!
    roomNumber: Int
    type: TaskType!
    status: TaskStatus!
    name: String!
    isRecurring: Boolean!
    start: String!
    end: String!
    credit: Int!
    comment: String
  }

  type Note {
    noteId: Int!
    message: String!
    date: String!
    formattedDate: String!
  }
`;

export default dataModels;
