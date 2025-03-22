import { gql } from "@apollo/client";

export const GET_AVAILABLE_ROOMS = gql`
  query getAvailableRooms {
    getAvailableRooms
  }
`;

export const GET_ALL_PARTICIPANTS = gql`
  query getAllParticipants {
    getAllParticipants {
      participantId
      roomNumber
      arrival
      departure
      password
      credit
    }
  }
`;

export const GET_PARTICIPANT_BY_ID = gql`
  query getParticipantById($participantId: String) {
    getParticipantById(participantId: $participantId) {
      participantId
      roomNumber
      arrival
      departure
      password
      credit
    }
  }
`;


export const GET_ALL_ANNOUNCEMENTS = gql`
  query getAllAnnouncements {
    getAllAnnouncements {
      announcementId
      from     
      to         
      createdAt
      message 
    }
  }
`

export const GET_ANNOUNCEMENT_BY_ROOMS = gql`
  query getAnnouncementByRooms($rooms: number[]) {
    getAnnouncementByRooms(rooms: $rooms) {
      announcementId
      from     
      to         
      createdAt
      message 
    }
  }
`

export const CREATE_ANNOUNCEMENT = gql`
  query createAnnouncement($announcementId: number,
    $from: StaffType,     
    $to: number[],          
    $createdAt: Date,
    $message: string,
    ) {
    createAnnouncement(announcementId: $announcementId, from: $from, to: $to, createdAt: $createdAt, message: $message) {
      announcementId
      from     
      to         
      createdAt
      message 
    }
  }
`