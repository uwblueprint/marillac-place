import { gql } from "apollo-server-express";

const taskType = gql`
enum Status {
    "PENDING_APPROVAL"
    "INCOMPLETE"
    "COMPLETE"
    "EXCUSED"
}

enum Recurrence_Frequency {
    "DAILY"
    "WEEKLY"
    "BI_WEEKLY"
}

input InputTaskDTO {
  category_id: Int!
  title: String!
  status: Status;
  description: String!
  assignee_id: Int!
  assigner_id: Int!
  credit_value: Int!
  start_date: Date!
  end_date?: Date | null!
  comments: String!
  recurrence_frequency: Recurrence_Frequency!
}

type TaskDTO {
  id: Int!
  category: String!
  category_id: Int!
  title: String!
  status: Status!
  description: String!
  assignee_id: Int!
  assignee: String!
  assigner_id: Int!
  assigner: String!
  credit_value: Int!
  start_date: Date!
  end_date?: Date | null!
  comments: String!
  recurrence_frequency: Recurrence_Frequency!
}
`;

export default taskType;
