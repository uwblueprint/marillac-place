import { gql } from "@apollo/client";

export const ADD_WARNING = gql`
    mutation AddWarning {
        addWarning(
            warning: {
                title: null
                description: null
                dateIssued: null
                assigneeId: null
                assignerId: null
                relatedTaskId: null
            }
        ) {
            id
            title
            description
            dateIssued
            assigneeId
            assignerId
            relatedTaskId
        }
    }
`;

export const DELETE_WARNING = gql`
    mutation DeleteWarning {
        deleteWarning(id: null) {
            id
            title
            description
            dateIssued
            assigneeId
            assignerId
            relatedTaskId
        }
    }
`;