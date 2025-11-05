import { gql } from "apollo-server-express";

const resolvers = gql`
  type Query {
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
    getNotes: [Note]
    getAllAnnouncements: [Announcement]
    getAnnouncementsInDateRange(start: String!, end: String!): [Announcement]
    getAnnouncementsByParticipants(participant_ids: [Int!]!): [Announcement]
    getAnnouncementsByParticipantId(participant_id: Int!): [UserAnnouncement]
    getAssignedTasks(participant_id: Int!): GetAssignedTaskResponse!
    getTasksByType(type: [TaskType!]!): [Task]
    getCustomBadges: [Badge]
    getSystemBadges: [Badge]
    getParticipantAnnouncements(
      participantId: Int!
      filter: AnnouncementFilter = ALL
    ): [UserAnnouncement!]!
    getParticipantAnnouncements(
      participantId: Int!
      filter: AnnouncementFilter = ALL
    ): [UserAnnouncement!]!
    getAssignedTasksByParticipantIdAndDate(
      participantId: Int!
      date: String!
    ): [AssignedTask]
    hasCompletedAllRequiredTasks(participantId: Int!): Boolean
    getEarnedBadgesByParticipant(participantId: Int!): [EarnedBadge!]!
    getReportRecipients: [ReportRecipient!]!
  }

  type Mutation {
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
    createNote(message: String!): Boolean
    deleteNote(note_id: Int!): Boolean
    createAnnouncement(
      priority: Priority!
      participants: [Int!]!
      message: String!
    ): Boolean
    editAnnouncement(
      announcement_id: Int!
      priority: Priority
      message: String
    ): Boolean
    deleteAnnouncement(announcement_id: Int!): Boolean
    updatePinReadAnnouncement(
      announcement_id: Int!
      participant_id: Int!
      pinned: Boolean
      read: Boolean
      announcement_id: Int!
      participant_id: Int!
      pinned: Boolean
      read: Boolean
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
    updateReportRecipient(
      report_recipient_id: Int!
      email: String
      weekly: Boolean
      monthly: Boolean
    ): Boolean
    deleteReportRecipient(report_recipient_id: Int!): Boolean
  }
`;

export default resolvers;
