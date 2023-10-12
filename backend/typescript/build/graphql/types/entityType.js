"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const entityType = apollo_server_express_1.gql `
  enum Enum {
    A
    B
    C
    D
  }

  scalar Upload

  type EntityResponseDTO {
    id: ID!
    stringField: String!
    intField: Int!
    enumField: Enum!
    stringArrayField: [String]!
    boolField: Boolean!
    fileName: String
  }

  input EntityRequestDTO {
    stringField: String!
    intField: Int!
    enumField: Enum!
    stringArrayField: [String]!
    boolField: Boolean!
    filePath: String
    contentType: String
  }

  extend type Query {
    entity(id: ID!): EntityResponseDTO!
    entities: [EntityResponseDTO!]!
    entitiesCSV: String!
    file(fileUUID: ID!): String!
  }

  extend type Mutation {
    createEntity(entity: EntityRequestDTO!, file: Upload): EntityResponseDTO!
    updateEntity(
      id: ID!
      entity: EntityRequestDTO!
      file: Upload
    ): EntityResponseDTO!
    deleteEntity(id: ID!): ID
  }
`;
exports.default = entityType;
