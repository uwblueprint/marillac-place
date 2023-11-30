import { gql } from "apollo-server-express";

// TODO: Look into custom types for dates and date time types


/*
    assignerId: ID!
    relatedTaskId: ID
*/
const warningType = gql`
  type WarningDTO {
    id: ID!
    title: String!
    description: String!
    dateIssued: String
    residentId: ID!
  }

  input CreateWarningDTO {
    title: String!
    description: String!
    dateIssued: String
    residentId: ID!
  }

  extend type Mutation {
    addWarning(warning: CreateWarningDTO!): WarningDTO!
    deleteWarning(id: ID!): WarningDTO!
  }
`;

export default warningType;
