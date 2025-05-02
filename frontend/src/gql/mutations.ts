import { gql } from "@apollo/client";

export const ADMIN_LOGIN = gql`
  mutation adminLogin($role: String!, $password: String!) {
    adminLogin(role: $role, password: $password) {
      token
    }
  }
`;

export const PARTICIPANT_LOGIN = gql`
  mutation participantLogin($id: String!, $password: String!) {
    participantLogin(id: $id, password: $password) {
      token
    }
  }
`;

// Participant Mutations
export const CREATE_PARTICIPANT = gql`
  mutation createParticipant(
    $participantId: String!
    $roomNumber: Int!
    $arrival: String!
    $password: String!
  ) {
    createParticipant(
      participantId: $participantId
      roomNumber: $roomNumber
      arrival: $arrival
      password: $password
    )
  }
`;

export const CREATE_ANNOUNCEMENT = gql`
  mutation createAnnouncement($announcementId: number,
    $from: StaffType,     
    $to: [Int],   
    $priority: PriorityType,       
    $createdAt: Date,
    $message: String,
    ) {
    createAnnouncement(
      announcementId: $announcementId
      from: $from
      to: $to
      priority: $priority
      createdAt: $createdAt
      message: $message
    )
  }
`;

export const EDIT_ANNOUNCEMENT = gql`
  mutation editAnnouncement($announcementId: number,
    $from: StaffType,     
    $to: [Int],          
    $priority: PriorityType,   
    $createdAt: Date,
    $message: String,
    ) {
    editAnnouncement(
      announcementId: $announcementId
      from: $from
      to: $to
      priority: $priority
      createdAt: $createdAt
      message: $message
    )
  }
`;

export const DELETE_ANNOUNCEMENT = gql`
  mutation deleteAnnouncement($announcementId: Int) {
    deleteAnnouncement(announcementId: $announcementId)
  }
`;

export const UPDATE_PARTICIPANT_BY_ID = gql`
  mutation updateParticipantById(
    $participantId: String!
    $roomNumber: Int
    $arrival: String
    $departure: String
    $password: String
  ) {
    updateParticipantById(
      participantId: $participantId
      roomNumber: $roomNumber
      arrival: $arrival
      departure: $departure
      password: $password
    )
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

// Note Mutations
export const CREATE_NOTE = gql`
  mutation createNote(
    $message: String!
    $date: String!
    $formattedDate: String!
  ) {
    createNote(message: $message, date: $date, formattedDate: $formattedDate)
  }
`;

export const DELETE_NOTE = gql`
  mutation deleteNote($noteId: Int!) {
    deleteNote(noteId: $noteId)
  }
`;

// Task Mutations
export const CREATE_TASK = gql`
  mutation createTask(
    $type: TaskType
    $name: String
    $recurrencePreference: RecurrenceFrequency
    $repeatDays: [DaysOfWeek]
    $timePreference: TimeOption 
    $start: String
    $end: String
    $credit: Int
    $deduction: Int
    $comment: String
  ) {
    createTask(
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
      taskId
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
    $taskId: Int!
    $type: TaskType
    $name: String
    $recurrencePreference: RecurrenceFrequency
    $repeatDays: [DaysOfWeek]
    $timePreference: TimeOption
    $start: String
    $end: String
    $credit: Int
    $deduction: Int
    $comment: String
  ) {
    updateTask(
      taskId: $taskId
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
      taskId
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

export const DELETE_TASK = gql`
  mutation deleteTask($taskId: Int!) {
    deleteTask(taskId: $taskId) {
      taskId
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
