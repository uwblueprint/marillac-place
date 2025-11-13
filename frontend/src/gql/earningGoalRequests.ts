import { gql } from "@apollo/client";

export const GET_EARNING_GOAL = gql`
  query getEarningGoal($pid: Int!) {
    getEarningGoal(pid: $pid) {
      pid
      action
      date
      value
    }
  }
`;

export const CREATE_EARNING_GOAL = gql`
  mutation createEarningGoal(
    $pid: Int!
    $action: GoalAction!
    $value: Int!
  ) {
    createEarningGoal(pid: $pid, action: $action, value: $value) {
      pid
      action
      date
      value
    }
  }
`;

export const UPDATE_EARNING_GOAL = gql`
  mutation updateEarningGoal($pid: Int!, $date: Date!, $value: Int!) {
    updateEarningGoal(pid: $pid, date: $date, value: $value) {
      pid
      action
      date
      value
    }
  }
`;
