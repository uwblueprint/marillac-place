import { gql } from "apollo-server-express";

const resolverTypes = gql`
    type Query {
        getPastParticipants: [Participant]
        getCurrentParticipants: [Participant]
        getParticipantById(participantId: String!): Participant
        getNotes: [Note]
        getTaskById(taskId: Int!): Task!
        getTasksByType(type: TaskType!): [Task!]
        getTasksByRecurrenceFrequency(
            recurrencePreference: RecurrenceFrequency!
        ): [Task!]
    }

    type Mutation {
        login(role: String!, encryptedPassword: String!): AuthResponse
        createParticipant(
            participantId: String!
            roomNumber: Int!
            arrival: String!
            password: String!
        ): Boolean
        updateParticipantById(
            participantId: String!
            roomNumber: Int
            arrival: String
            departure: String
            password: String
        ): Boolean
        createNote(message: String!, date: String!, formattedDate: String!): Boolean
        deleteNote(noteId: Int!): Boolean
        createTask(
            type: TaskType
            name: String
            recurrencePreference: RecurrenceFrequency
            repeatDays: [DaysOfWeek]
            timePreference: TimeOption
            credit: Int
            deduction: Int
            start: String
            end: String
            comment: String
        ): Task!
        updateTask(
            taskId: Int
            type: TaskType
            name: String
            recurrencePreference: RecurrenceFrequency
            repeatDays: [DaysOfWeek]
            timePreference: TimeOption
            credit: Int
            deduction: Int
            start: String
            end: String
            comment: String
        ): Task!
        deleteTask(taskId: Int!): Task!
    }
`;

export default resolverTypes;
