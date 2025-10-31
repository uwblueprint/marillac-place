import { gql } from "@apollo/client";

export const UPDATE_BADGE_STATUS = gql`
  mutation updateBadgeStatus($badge_id: Int!, $is_active: Boolean!) {
    updateBadgeStatus(badge_id: $badge_id, is_active: $is_active)
  }
`;

export const ADMIN_LOGIN = gql`
  mutation adminLogin($role: String!, $password: String!) {
    adminLogin(role: $role, password: $password) {
      token
    }
  }
`;

export const PARTICIPANT_LOGIN = gql`
  mutation participantLogin($id: Int!, $password: String!) {
    participantLogin(id: $id, password: $password) {
      token
    }
  }
`;

export const CREATE_PARTICIPANT = gql`
  mutation createParticipant(
    $participant_id: Int!
    $room_number: Int!
    $arrival_date: String!
    $password: String!
  ) {
    createParticipant(
      participant_id: $participant_id
      room_number: $room_number
      arrival_date: $arrival_date
      password: $password
    )
  }
`;

export const UPDATE_PARTICIPANT = gql`
  mutation updateParticipant(
    $participant_id: Int!
    $room_number: Int
    $arrival_date: String
    $departure_date: String
    $account_creation_date: String
    $account_removal_date: String
    $marillac_bucks: Int
    $marillac_bucks_goal: Int
    $password: String
  ) {
    updateParticipant(
      participant_id: $participant_id
      room_number: $room_number
      arrival_date: $arrival_date
      departure_date: $departure_date
      account_creation_date: $account_creation_date
      account_removal_date: $account_removal_date
      marillac_bucks: $marillac_bucks
      marillac_bucks_goal: $marillac_bucks_goal
      password: $password
    )
  }
`;

export const UPDATE_MARILLAC_BUCKS = gql`
  mutation updateMarillacBucks(
    $participant_id: Int!
    $marillac_bucks: Int!
    $reason: String!
  ) {
    updateMarillacBucks(
      participant_id: $participant_id
      marillac_bucks: $marillac_bucks
      reason: $reason
    )
  }
`;

export const CREATE_ANNOUNCEMENT = gql`
  mutation createAnnouncement(
    $priority: Priority!
    $participants: [Int!]!
    $message: String!
  ) {
    createAnnouncement(
      priority: $priority
      participants: $participants
      message: $message
    )
  }
`;

export const CREATE_ASSIGNED_TASK = gql`
  mutation createAssignedTask(
    $participantId: Int!
    $taskName: String!
    $startDate: String!
    $endDate: String!
    $marillacBucksAddition: Int!
    $marillacBucksDeduction: Int!
    $taskType: TaskType!
    $goalName: String
    $goalDescription: String
    $comment: String
  ) {
    createAssignedTask(
      participantId: $participantId
      taskName: $taskName
      startDate: $startDate
      endDate: $endDate
      marillacBucksAddition: $marillacBucksAddition
      marillacBucksDeduction: $marillacBucksDeduction
      taskType: $taskType
      goalName: $goalName
      goalDescription: $goalDescription
      comment: $comment
    )
  }
`;


export const EDIT_ANNOUNCEMENT = gql`
  mutation editAnnouncement(
    $announcement_id: Int!
    $priority: Priority
    $message: String
  ) {
    editAnnouncement(
      announcement_id: $announcement_id
      priority: $priority
      message: $message
    )
  }
`;

export const DELETE_ANNOUNCEMENT = gql`
  mutation DeleteAnnouncement($announcement_id: Int!) {
    deleteAnnouncement(announcement_id: $announcement_id)
  }
`;

export const EDIT_MARILLAC_BUCKS = gql`
  mutation EditMarillacBucks($participantId: String, $credit: Int) {
    editMarillacBucks(participantId: $participantId, credit: $credit)
  }
`;

export const CREATE_NOTE = gql`
  mutation createNote($message: String!) {
    createNote(message: $message)
  }
`;

export const DELETE_NOTE = gql`
  mutation deleteNote($note_id: Int!) {
    deleteNote(note_id: $note_id)
  }
`;

export const CREATE_TASK = gql`
  mutation CreateTask(
    $type: TaskType!
    $name: String!
    $recurrencePreference: RecurrenceFrequency!
    $repeatDays: [DayOfWeek!]!
    $timePreference: TimeOption!
    $marillacBucks: Int!
    $deduction: Int!
    $startTime: String
    $endTime: String
    $comment: String
  ) {
    createTask(
      type: $type
      name: $name
      recurrencePreference: $recurrencePreference
      repeatDays: $repeatDays
      timePreference: $timePreference
      marillacBucks: $marillacBucks
      deduction: $deduction
      startTime: $startTime
      endTime: $endTime
      comment: $comment
    )
  }
`;

export const DELETE_ASSIGNED_TASK = gql`
  mutation DeleteAssignedTask($assigned_task_id: Int!) {
    deleteAssignedTask(assigned_task_id: $assigned_task_id)
  }
`;

export const UPDATE_TASK = gql`
  mutation updateTask(
    $id: Int!
    $type: TaskType
    $name: String
    $recurrencePreference: RecurrenceFrequency
    $repeatDays: [DayOfWeek!]
    $timePreference: TimeOption
    $marillacBucks: Int
    $deduction: Int
    $startTime: String
    $endTime: String
    $comment: String
  ) {
    updateTask(
      id: $id
      type: $type
      name: $name
      recurrencePreference: $recurrencePreference
      repeatDays: $repeatDays
      timePreference: $timePreference
      marillacBucks: $marillacBucks
      deduction: $deduction
      startTime: $startTime
      endTime: $endTime
      comment: $comment
    )
  }
`;

export const DELETE_TASK = gql`
  mutation deleteTaskById($taskId: Int!) {
    deleteTaskById(taskId: $taskId)
  }
`;

export const DELETE_CUSTOM_BADGE = gql`
  mutation deleteCustomBadge($badge_id: Int!) {
    deleteCustomBadge(badge_id: $badge_id)
  }
`;

export const CREATE_CUSTOM_BADGE = gql`
  mutation createCustomBadge(
    $name: String!
    $description: String!
    $icon: Icon!
  ) {
    createCustomBadge(name: $name, description: $description, icon: $icon)
  }
`;

export const EDIT_CUSTOM_BADGE = gql`
  mutation editCustomBadge(
    $custom_badge_id: Int!
    $new_custom_badge_name: String
    $new_custom_badge_description: String
  ) {
    editCustomBadge(
      custom_badge_id: $custom_badge_id
      new_custom_badge_name: $new_custom_badge_name
      new_custom_badge_description: $new_custom_badge_description
    )
  }
`;

export const EDIT_BADGE_LEVEL = gql`
  mutation editBadgeLevel(
    $badge_id: Int!
    $badge_level: Int!
    $benchmark: Int!
    $marillac_bucks: Int!
  ) {
    editBadgeLevel(
      badge_id: $badge_id
      badge_level: $badge_level
      benchmark: $benchmark
      marillac_bucks: $marillac_bucks
    )
  }
`;

export const EDIT_SYSTEM_BADGE = gql`
  mutation editSystemBadge(
    $system_badge_id: Int!
    $system_badge_name: String!
    $system_badge_criteria: String
  ) {
    editSystemBadge(
      system_badge_id: $system_badge_id
      system_badge_name: $system_badge_name
      system_badge_criteria: $system_badge_criteria
    )
  }
`;

export const ASSIGN_CUSTOM_BADGE = gql`
  mutation assignCustomBadge(
    $badge_id: Int!
    $marillac_bucks: Int!
    $participant_ids: [Int!]!
  ) {
    assignCustomBadge(
      badge_id: $badge_id
      marillac_bucks: $marillac_bucks
      participant_ids: $participant_ids
    )
  }
`;
export const SET_MARILLAC_BUCKS_GOAL = gql`
  mutation setMarillacBucksGoal($participant_id: Int!, $goal_value: Int!) {
    setMarillacBucksGoal(participant_id: $participant_id, goal_value: $goal_value)
  }
`;

export const UPDATE_PIN_READ_ANNOUNCEMENTS = gql`
  mutation UpdatePinReadAnnouncement(
    $announcement_id: Int!
    $participant_id: Int!
    $pinned: Boolean
    $read: Boolean
  ) {
    updatePinReadAnnouncement(
      announcement_id: $announcement_id
      participant_id: $participant_id
      pinned: $pinned
      read: $read
    )
  }
`

export const UPDATE_MARILLAC_BUCKS_GOAL = gql`
  mutation updateMarillacBucksGoal($participant_id: Int!, $new_goal_value: Int!) {
    updateMarillacBucksGoal(participant_id: $participant_id, new_goal_value: $new_goal_value)
  }
`;

export const UPDATE_ASSIGNED_TASK = gql`
  mutation UpdateAssignedTask(
    $id: Int!
    $taskName: String
    $taskStatus: Status
    $taskType: TaskType
    $goalName: String
    $goalDescription: String
    $startDate: String
    $endDate: String
    $marillacBucksAddition: Int
    $marillacBucksDeduction: Int
    $comment: String
  ) {
    updateAssignedTask(
      id: $id
      taskName: $taskName
      taskStatus: $taskStatus
      taskType: $taskType
      goalName: $goalName
      goalDescription: $goalDescription
      startDate: $startDate
      endDate: $endDate
      marillacBucksAddition: $marillacBucksAddition
      marillacBucksDeduction: $marillacBucksDeduction
      comment: $comment
    )
  }
`;

export const CREATE_REPORT_RECIPIENT = gql`
  mutation createReportRecipient($email: String!, $weekly: Boolean!, $monthly: Boolean!) {
    createReportRecipient(email: $email, weekly: $weekly, monthly: $monthly)
  }
`;

export const UPDATE_REPORT_RECIPIENT = gql`
  mutation updateReportRecipient(
    $report_recipient_id: Int!
    $email: String
    $weekly: Boolean
    $monthly: Boolean
  ) {
    updateReportRecipient(
      report_recipient_id: $report_recipient_id
      email: $email
      weekly: $weekly
      monthly: $monthly
    )
  }
`;

export const DELETE_REPORT_RECIPIENT = gql`
  mutation deleteReportRecipient($report_recipient_id: Int!) {
    deleteReportRecipient(report_recipient_id: $report_recipient_id)
  }
`;
