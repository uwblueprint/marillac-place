import { gql } from "apollo-server-express";

const warningType = gql`
  type WarningDTO {
    id: Int!
    title: String!
    description: String!
    dateIssued: DateTime
    assigneeId: Int!
    assignerId: Int
    relatedTaskId: Int
  }

  input CreateWarningDTO {
    title: String!
    description: String!
    dateIssued: DateTime
    assigneeId: Int!
    assignerId: Int
    relatedTaskId: Int
  }

  extend type Mutation {
    addWarning(warning: CreateWarningDTO!): WarningDTO!
    deleteWarning(id: Int!): WarningDTO!
  }
`;

export default warningType;
