"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const simpleEntityType = apollo_server_express_1.gql `
  enum SimpleEntityEnum {
    A
    B
    C
    D
  }

  type SimpleEntityResponseDTO {
    id: ID!
    stringField: String!
    intField: Int!
    enumField: SimpleEntityEnum!
    stringArrayField: [String]!
    boolField: Boolean!
  }

  input SimpleEntityRequestDTO {
    stringField: String!
    intField: Int!
    enumField: Enum!
    stringArrayField: [String]!
    boolField: Boolean!
  }

  extend type Query {
    simpleEntity(id: ID!): SimpleEntityResponseDTO!
    simpleEntities: [SimpleEntityResponseDTO!]!
    simpleEntitiesCSV: String!
  }

  extend type Mutation {
    createSimpleEntity(
      entity: SimpleEntityRequestDTO!
    ): SimpleEntityResponseDTO!
    updateSimpleEntity(
      id: ID!
      entity: SimpleEntityRequestDTO!
    ): SimpleEntityResponseDTO!
    deleteSimpleEntity(id: ID!): ID
  }
`;
exports.default = simpleEntityType;
