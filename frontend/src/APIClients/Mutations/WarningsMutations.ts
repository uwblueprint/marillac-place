import { gql } from "@apollo/client";

export const ADD_WARNING = gql`
  mutation AddWarning($warning: CreateWarningDTO!) {
    addWarning(warning: $warning) {
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
  mutation DeleteWarning($warningId: ID!) {
    deleteWarning(id: $warningId) {
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
