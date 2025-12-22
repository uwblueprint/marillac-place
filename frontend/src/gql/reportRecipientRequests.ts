import { gql } from "@apollo/client";

export const GET_REPORT_RECIPIENTS = gql`
  query getReportRecipients {
    getReportRecipients {
      email
      weekly
      monthly
    }
  }
`;

export const CREATE_REPORT_RECIPIENT = gql`
  mutation createReportRecipient(
    $email: String!
    $weekly: Boolean!
    $monthly: Boolean!
  ) {
    createReportRecipient(email: $email, weekly: $weekly, monthly: $monthly) {
      email
      weekly
      monthly
    }
  }
`;

export const UPDATE_REPORT_RECIPIENT = gql`
  mutation updateReportRecipient(
    $email: String!
    $weekly: Boolean
    $monthly: Boolean
  ) {
    updateReportRecipient(email: $email, weekly: $weekly, monthly: $monthly) {
      email
      weekly
      monthly
    }
  }
`;

export const DELETE_REPORT_RECIPIENT = gql`
  mutation deleteReportRecipient($email: String!) {
    deleteReportRecipient(email: $email) {
      email
      weekly
      monthly
    }
  }
`;
