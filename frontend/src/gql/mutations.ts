import { gql } from "@apollo/client";

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
    $participant_id: Int!,
    $room_number: Int!,
    $arrival_date: String!,
    $password: String!,
  ) {
    createParticipant(
      participant_id: $participant_id,
      room_number: $room_number,
      arrival_date: $arrival_date,
      password: $password,
    )
  }
`;

export const UPDATE_PARTICIPANT = gql`
  mutation updateParticipant(
    $participant_id: Int!,
    $room_number: Int,
    $arrival_date: String,
    $departure_date: String,
    $account_creation_date: String,
    $account_removal_date: String,
    $marillac_bucks: Int,
    $marillac_bucks_goal: Int,
    $password: String,
  ) {
    updateParticipant(
      participant_id: $participant_id,
      room_number: $room_number,
      arrival_date: $arrival_date,
      departure_date: $departure_date,
      account_creation_date: $account_creation_date,
      account_removal_date: $account_removal_date,
      marillac_bucks: $marillac_bucks,
      marillac_bucks_goal: $marillac_bucks_goal,
      password: $password,
    )
  }
`;

export const UPDATE_MARILLAC_BUCKS = gql`
  mutation updateMarillacBucks(
    $participant_id: Int!,
    $marillac_bucks: Int!,
    $reason: String!,
  ) {
    updateMarillacBucks(
      participant_id: $participant_id,
      marillac_bucks: $marillac_bucks,
      reason: $reason,
    )
  }
`;


export const CREATE_ANNOUNCEMENT = gql`
  mutation createAnnouncement(
    $priority: Priority!, 
    $participants: [Int!]!,
    $message: String!,
  ) {
    createAnnouncement(
      priority: $priority
      participants: $participants
      message: $message
    )
  }
`;

export const EDIT_ANNOUNCEMENT = gql`
  mutation editAnnouncement(
    $announcement_id: Int!,
    $priority: Priority,
    $message: String
  ) {
    editAnnouncement(
      announcement_id: $announcement_id,
      priority: $priority,
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
    mutation EditMarillacBucks(
        $participantId: String
        $credit : Int
    ) {
        editMarillacBucks(
            participantId: $participantId
            credit: $credit
        )
    }
`;

export const CREATE_NOTE = gql`
  mutation createNote(
    $message: String!
    $creation_date: String!
  ) {
    createNote(message: $message, creation_date: $creation_date)
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

export const CREATE_ASSIGNED_TASK = gql`
    mutation createAssignedTask(
        $userID: Int
        $type: TaskType!
        $name: String!
        $recurrencePreference: RecurrenceFrequency
        $repeatDays: [String]
        $timePreference: TimeOption!
        $start: String
        $end: String
        $credit: Int!
        $deduction: Int
        $comment: String
    ) {
        createAssignedTask(
            userID: $userID
            type: $type
            name: $name
            recurrencePreference: $recurrencePreference
            repeatDays: $repeatDays
            timePreference: $timePreference
            start: $start
            end: $end
            credit: $credit
            deduction: $deduction
            comment: $comment
        ) {
            assignedTaskId
            userID
            type
            name
            recurrencePreference
            repeatDays
            timePreference
            start
            end
            credit
            deduction
            comment
        }
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
  mutation createCustomBadge($name: String!, $description: String!, $icon: Icon!) {
    createCustomBadge(name: $name, description: $description, icon: $icon)
  }
`;

export const EDIT_CUSTOM_BADGE = gql`
  mutation editCustomBadge(
    $custom_badge_id: Int!,
    $new_custom_badge_name: String,
    $new_custom_badge_description: String,
  ) {
    editCustomBadge(
      custom_badge_id: $custom_badge_id,
      new_custom_badge_name: $new_custom_badge_name,
      new_custom_badge_description: $new_custom_badge_description
    )
  }
`;
