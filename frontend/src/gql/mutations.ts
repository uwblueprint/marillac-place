import { gql } from "@apollo/client";

export const CREATE_PARTICIPANT = gql`
  mutation createParticipant(
    $participantId: String
    $roomNumber: Int
    $arrival: String
    $password: String
  ) {
    createParticipant(
      participantId: $participantId
      roomNumber: $roomNumber
      arrival: $arrival
      password: $password
    )
  }
`;

// export const CREATE_TASK = gql`
//   mutation createTask(
//     $taskId: Int
//     $roomNumber: Int?
//     $Type: TaskType
//     $Status: TaskStatus
//     $Name: String
//     $isRecurring: Boolean
//     $Start: DateTime
//     $End: DateTime
//     $Credit: Int
//     $Comment: String?
//   ) {
//     createTask(
//       taskId: $taskId
//       roomNumber: $roomNumber
//       Type: $Type
//       Status: $Status
//       Name: $Name
//       isRecurring: $isRecurring
//       Start: $Start
//       End: $End
//       Credit: $Credit
//       Comment: $Comment
//     )
//   }
// `;

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
`
