import { gql } from "apollo-server-express";

const warningType = gql`
  type WarningDTO {
    id: ID!
    title: String!
    description: String!
    dateIssued: DateTime
    assigneeId: ID!
    assignerId: ID
    relatedTaskId: ID
  }

  input CreateWarningDTO {
    title: String!
    description: String!
    dateIssued: DateTime
    assigneeId: ID!
    assignerId: ID
    relatedTaskId: ID
  }

  extend type Mutation {
    addWarning(warning: CreateWarningDTO!): WarningDTO!
    deleteWarning(id: ID!): WarningDTO!
  }
`;

export default warningType;
