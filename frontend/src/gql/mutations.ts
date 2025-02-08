import { gql } from "@apollo/client";

export const CREATE_PARTICIPANT = gql`
    mutation createParticipant($participantId: String, $roomNumber: Int, $arrival: String, $password: String) {
        createParticipant(participantId: $participantId, roomNumber: $roomNumber, arrival: $arrival, password: $password)
    }
`;
