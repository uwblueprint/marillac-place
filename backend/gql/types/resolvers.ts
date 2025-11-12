import { gql } from "apollo-server-express";

const resolvers = gql`
  type Query {
    getNotes: [Note!]!

    getReportRecipients: [ReportRecipient!]!

    getAnnouncementsFromToday: [Announcement!]!
    getAnnouncementsSentToParticipants(pids: [Int!]!): [Announcement!]!

    getReceivedAnnouncements(
      pid: Int!
      unread: Boolean
      pinned: Boolean
      important: Boolean
    ): [ReceivedAnnouncement!]!

    getEarningGoal(pid: Int!): EarningGoal

    getTasksByType(type: TaskType!): [Task!]!

    getCustomBadges: [Badge!]!
    
    getWeeklyEarnings(pid: Int!): GetWeeklyEarningsResponse!

    getCurrentParticipants: [Participant!]!
    getPastParticipants: [Participant!]!

    getSystemBadges: [SystemBadge!]!

    getNumberOfAssignedTasksByRoom: [Int!]!
    getAssignedTasksForToday(pid: Int!): [AssignedTask!]!
    getAssignedTasksByWeek(pid: Int!, weekStart: Date!): [AssignedTask!]!

    getEarnedCustomBadges(pid: Int!): [EarnedCustomBadge!]!

    getAchievedBadgeLevels(pid: Int!): [AchievedBadgeLevel!]!
  }

  type Mutation {
    createNote(message: String!): Note!
    deleteNote(nid: Int!): Note!

    createReportRecipient(
      email: String!
      weekly: Boolean!
      monthly: Boolean!
    ): ReportRecipient!
    updateReportRecipient(
      email: String!
      weekly: Boolean
      monthly: Boolean
    ): ReportRecipient!
    deleteReportRecipient(email: String!): ReportRecipient!

    createAnnouncement(
      priority: Priority!
      pids: [Int!]!
      message: String!
    ): Announcement!
    updateAnnouncement(
      aid: Int!
      priority: Priority
      message: String
    ): Announcement!
    deleteAnnouncement(aid: Int!): Announcement!

    updateReceivedAnnouncement(
      aid: Int!
      pid: Int!
      pinned: Boolean
      read: Boolean
    ): ReceivedAnnouncement!

    createEarningGoal(
      pid: Int!
      action: GoalAction!
      value: Int!
    ): EarningGoal!
    updateEarningGoal(
      pid: Int!
      date: Date!
      value: Int!
    ): EarningGoal!

    createTask(
      type: TaskType!
      name: String
      value: Int!
      penalty: Int!
      day_preference: DayPreference!
      days: [DayOfWeek!]!
      time_preference: TimePreference!
      start_time: Date
      end_time: Date
      comment: String
    ): Task!
    updateTask(
      tid: Int!
      type: TaskType
      name: String
      value: Int
      penalty: Int
      day_preference: DayPreference
      days: [DayOfWeek!]
      time_preference: TimePreference
      start_time: Date
      end_time: Date
      comment: String
    ): Task!
    deleteTask(tid: Int!): Task!

    adminLogin(role: String!, password: String!): AdminLoginResponse!
    participantLogin(pid: Int!, password: String!): ParticipantLoginResponse!

    createCustomBadge(name: String!, description: String!, icon: Icon!): CustomBadge!
    updateCustomBadge(
      bid: Int!
      name: String
      description: String
      icon: Icon
    ): CustomBadge!
    deleteCustomBadge(bid: Int!): CustomBadge!

    createParticipant(
      pid: Int!
      password: String!
      room: Int!
      arrival: Date!
    ): Participant!
    updateParticipant(
      pid: Int!;
      password: String
      room: Int
      arrival: Date
      departure: String
    ): Participant!

    updateBalance(pid: Int!, amount: Int!, reason: String!): Transaction!

    createEarnedCustomBadge(pid: Int!, bid: Int!): EarnedCustomBadge!

    updateSystemBadge(name: String!, description: String, is_active: Boolean): SystemBadge!

    updateBadgeLevel(
      name: String!
      level: Level!
      benchmark: Int
      value: Int
    ): BadgeLevel!

    createAssignedTask(
      tid: Int!
      pid: Int!
      value: Int!
      penalty: Int!
      start_date: Date!
      end_date: Date!
      comment: String
    ): AssignedTask!
    updateAssignedTask(
      tid: Int!
      pid: Int!
      value: Int
      penalty: Int
      start_date: Date
      end_date: Date
      comment: String
    ): AssignedTask!
    updateAssignedTaskStatus(
      tid: Int!
      pid: Int!
      status: TaskStatus!
    ): AssignedTask!
    deleteAssignedTask(tid: Int!, pid: Int!): AssignedTask!
  }
`;

export default resolvers;
