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

export const CREATE_ANNOUNCEMENT = gql`
  mutation createAnnouncement($announcementId: number,
    $from: StaffType,     
    $to: number[],   
    $priority: PriorityType,       
    $createdAt: Date,
    $message: string,
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
    $to: number[],          
    $priority: PriorityType,   
    $createdAt: Date,
    $message: string,
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

export const DELETE_ANNOUNCEMENT = gql`
  mutation deleteAnnouncement($announcementId: number,
    ) {
    deleteAnnouncement(
      announcementId: $announcementId
    )
  }
`;