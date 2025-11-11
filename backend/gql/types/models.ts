import { gql } from "apollo-server-express";

const models = gql`
  type Participant {
    pid: Int!
    password: String!
    room: Int!
    arrival: DateTime!
    departure: DateTime
    balance: Int!
  }

  type Transaction {
    pid: Int!
    date: DateTime!
    amount: Int!
    type: TransactionType!
    reason: String!
  }

  type EarningGoal {
    pid: Int!
    action: GoalAction!
    date: DateTime!
    value: Int!
  }

  type LoginHistory {
    pid: Int!
    date: DateTime!
  }

  type Announcement {
    aid: Int!
    date: DateTime!
    message: String!
    priority: Priority!
  }

  type ReceivedAnnouncement {
    aid: Int!
    pid: Int!
    read: Boolean!
    pinned: Boolean!
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

  type AssignedTask {
    tid: Int!
    pid: Int!
    status: TaskStatus!
    value: Int!
    penalty: Int!
    comment: String
    start_date: DateTime!
    end_date: DateTime!
  }

  type CustomBadge {
    bid: Int!
    name: String!
    icon: Icon!
    description: String!
  }

  type EarnedCustomBadge {
    bid: Int!
    pid: Int!
  }

  type SystemBadge {
    name: String!
    icon: Icon!
    description: String!
    is_active: Boolean!
  }

  type BadgeLevel {
    name: String!
    level: Level!
    value: Int!
    benchmark: Int!
  }

  type AchievedBadgeLevel {
    name: String!
    level: Level!
    pid: Int!
  }

  type BadgeLevelProgress {
    name: String!
    level: Level!
    pid: Int!
    progress: Int!
    lost_streak: Boolean!
  }

  type Note {
    nid: Int!
    message: String!
    date: DateTime!
  }

  type ReportRecipient {
    email: String!
    weekly: Boolean!
    monthly: Boolean!
  }
`;

export default models;
