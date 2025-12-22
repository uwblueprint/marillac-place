import { gql } from "apollo-server-express";

const models = gql`
  type AchievedBadgeLevel {
    name: String!
    level: Level!
    pid: Int!
    notified: Boolean!
    date: Date!

    badge_level: BadgeLevel
    participant: Participant
  }

  type Announcement {
    aid: Int!
    date: DateTime!
    message: String!
    priority: Priority!

    ReceivedAnnouncement: [ReceivedAnnouncement!]
  }

  type AssignedTask {
    aid: Int!
    pid: Int!
    tid: Int!
    name: String!
    type: TaskType!
    status: TaskStatus!
    value: Int!
    penalty: Int!
    comment: String
    start_date: DateTime!
    end_date: DateTime!

    participant: Participant
  }

  type BadgeLevel {
    name: String!
    level: Level!
    value: Int!
    benchmark: Int!

    AchievedBadgeLevel: [AchievedBadgeLevel!]
    BadgeLevelProgress: [BadgeLevelProgress!]

    system_badge: SystemBadge
  }

  type BadgeLevelProgress {
    name: String!
    level: Level!
    pid: Int!
    progress: Int!

    badge_level: BadgeLevel
    participant: Participant
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

    participant: Participant
  }

  type EarnedCustomBadge {
    eid: Int!
    pid: Int!
    name: String!
    icon: Icon!
    description: String!
    notified: Boolean!

    participant: Participant
  }

  type LoginHistory {
    pid: Int!
    date: DateTime!

    participant: Participant
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

    Transaction: [Transaction!]
    EarningGoal: [EarningGoal!]
    LoginHistory: [LoginHistory!]
    ReceivedAnnouncement: [ReceivedAnnouncement!]
    AssignedTask: [AssignedTask!]
    EarnedCustomBadge: [EarnedCustomBadge!]
    AchievedBadgeLevel: [AchievedBadgeLevel!]
    BadgeLevelProgress: [BadgeLevelProgress!]
  }

  type ReceivedAnnouncement {
    aid: Int!
    pid: Int!
    read: Boolean!
    pinned: Boolean!

    participant: Participant
    announcement: Announcement
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

    BadgeLevel: [BadgeLevel!]
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

    participant: Participant
  }
`;

export default models;
