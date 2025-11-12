import { gql } from "apollo-server-express";

const models = gql`
  type AchievedBadgeLevel {
    name: String!
    level: Level!
    pid: Int!
    date: Date!
  }

  type Announcement {
    aid: Int!
    date: DateTime!
    message: String!
    priority: Priority!
  }

  type AssignedTask {
    aid: Int!
    pid: Int!
    name: String!
    type: TaskType!
    status: TaskStatus!
    value: Int!
    penalty: Int!
    comment: String
    start_date: DateTime!
    end_date: DateTime!
  }

  type BadgeLevel {
    name: String!
    level: Level!
    value: Int!
    benchmark: Int!
  }

  type BadgeLevelProgress {
    name: String!
    level: Level!
    pid: Int!
    progress: Int!
  }

  type CustomBadge {
    cid: Int!
    name: String!
    icon: Icon!
    description: String!
  }

  type EarningGoal {
    pid: Int!
    action: GoalAction!
    date: DateTime!
    value: Int!
  }

  type EarnedCustomBadge {
    eid: Int!
    pid: Int!
    name: String!
    icon: Icon!
    description: String!
  }

  type LoginHistory {
    pid: Int!
    date: DateTime!
  }

  type Note {
    nid: Int!
    message: String!
    date: DateTime!
  }

  type Participant {
    pid: Int!
    password: String!
    room: Int!
    arrival: DateTime!
    departure: DateTime
    balance: Int!
    total_earnings: Int!
  }

  type ReceivedAnnouncement {
    aid: Int!
    pid: Int!
    read: Boolean!
    pinned: Boolean!
  }

  type ReportRecipient {
    email: String!
    weekly: Boolean!
    monthly: Boolean!
  }

  type SystemBadge {
    name: String!
    icon: Icon!
    description: String!
    is_active: Boolean!
  }

  type Task {
    tid: Int!
    name: String!
    type: TaskType!
    value: Int!
    penalty: Int!
    comment: String
    day_preference: DayPreference!
    days: [DayOfWeek!]!
    time_preference: TimePreference!
    start_time: Time
    end_time: Time
  }

  type Transaction {
    pid: Int!
    date: DateTime!
    amount: Int!
    type: TransactionType!
    reason: String!
  }
`;

export default models;
