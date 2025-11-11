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
    

    getPastParticipants: [Participant]
    getCurrentParticipants: [Participant]
    getParticipantByRoom(room_number: Int!): Participant
    getParticipantsByRooms(room_numbers: [Int!]!): [Participant]
    getParticipantById(participantId: Int!): Participant
    getWeeklyEarnings(participant_id: Int!): [Int!]!
    getGoalHistoryByParticipant(
      participant_id: Int!
      start_date: String
      end_date: String
    ): [GoalHistory!]!
    getAssignedTasks(participant_id: Int!): GetAssignedTaskResponse!
    getTasksByType(type: [TaskType!]!): [Task]
    getCustomBadges: [Badge]
    getSystemBadges: [Badge]
    getAssignedTasksByParticipantIdAndDate(
      participantId: Int!
      date: String!
    ): [AssignedTask]
    hasCompletedAllRequiredTasks(participantId: Int!): Boolean
    getEarnedBadgesByParticipant(participantId: Int!): [EarnedBadge!]!
  
  }

  type Mutation {
    createNote(message: String!): Note!
    deleteNote(nid: Int!): Note!

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


    adminLogin(role: String!, password: String!): LoginResponse
    participantLogin(id: Int!, password: String!): LoginResponse
    createCustomBadge(name: String!, description: String!, icon: Icon!): Boolean
    createParticipant(
      participant_id: Int!
      room_number: Int!
      arrival_date: String!
      password: String!
    ): Boolean
    updateParticipant(
      participant_id: Int!
      room_number: Int
      arrival_date: String
      password: String
      departure_date: String
      account_creation_date: String
      account_removal_date: String
      marillac_bucks: Int
      marillac_bucks_goal: Int
    ): Boolean
    updateMarillacBucks(
      participant_id: Int!
      marillac_bucks: Int!
      reason: String!
    ): Boolean
    createTask(
      type: TaskType!
      name: String!
      recurrencePreference: RecurrenceFrequency!
      repeatDays: [DayOfWeek!]!
      timePreference: TimeOption!
      marillacBucks: Int!
      deduction: Int!
      startTime: String
      endTime: String
      comment: String
    ): Boolean
    updateTask(
      id: Int!
      type: TaskType
      name: String
      recurrencePreference: RecurrenceFrequency
      repeatDays: [DayOfWeek!]
      timePreference: TimeOption
      marillacBucks: Int
      deduction: Int
      startTime: String
      endTime: String
      comment: String
    ): Boolean
    deleteTaskById(taskId: Int!): Boolean
    assignCustomBadge(
      badge_id: Int!
      marillac_bucks: Int!
      participant_ids: [Int!]!
    ): [Int!]!
    updateAssignedTask(
      id: Int!
      taskName: String
      taskStatus: Status
      taskType: TaskType
      goalName: String
      goalDescription: String
      startDate: String
      endDate: String
      marillacBucksAddition: Int
      marillacBucksDeduction: Int
      comment: String
    ): Boolean
    editCustomBadge(
      custom_badge_id: Int!
      new_custom_badge_name: String
      new_custom_badge_description: String
    ): Boolean
    deleteCustomBadge(badge_id: Int!): Boolean!
    deleteAssignedTask(assigned_task_id: Int!): Boolean!
    createAssignedTask(
      participantId: Int!
      taskName: String!
      startDate: String!
      endDate: String!
      marillacBucksAddition: Int!
      marillacBucksDeduction: Int!
      taskType: TaskType!
      goalName: String
      goalDescription: String
      comment: String
    ): Boolean
    editBadgeLevel(
      badge_id: Int!
      badge_level: Int!
      benchmark: Int!
      marillac_bucks: Int!
    ): Boolean
    editSystemBadge(
      system_badge_id: Int!
      system_badge_name: String!
      system_badge_criteria: String
    ): Boolean
    updateBadgeStatus(badge_id: Int!, is_active: Boolean!): Boolean
    setMarillacBucksGoal(participant_id: Int!, goal_value: Int!): Boolean
    updateMarillacBucksGoal(participant_id: Int!, new_goal_value: Int!): Boolean
    createReportRecipient(
      email: String!
      weekly: Boolean!
      monthly: Boolean!
    ): Boolean
  }
`;

export default resolvers;
