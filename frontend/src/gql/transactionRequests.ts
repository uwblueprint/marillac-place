import { gql } from "@apollo/client";

export const GET_WEEKLY_EARNINGS = gql`
  query getWeeklyEarnings($pid: Int!) {
    getWeeklyEarnings(pid: $pid) {
      SUNDAY
      MONDAY
      TUESDAY
      WEDNESDAY
      THURSDAY
      FRIDAY
      SATURDAY
    }
  }
`;

export const UPDATE_BALANCE = gql`
  mutation updateBalance(
    $pid: Int!
    $amount: Int!
    $reason: String!
  ) {
    updateBalance(pid: $pid, amount: $amount, reason: $reason) {
      pid
      date
      amount
      type
      reason
    }
  }
`;
