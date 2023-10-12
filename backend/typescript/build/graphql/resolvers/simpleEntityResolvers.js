"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const simpleEntityService_1 = __importDefault(require("../../services/implementations/simpleEntityService"));
const CSVUtils_1 = require("../../utilities/CSVUtils");
const simpleEntityService = new simpleEntityService_1.default();
const entityResolvers = {
    Query: {
        simpleEntity: async (_req, { id }) => {
            return simpleEntityService.getEntity(id);
        },
        simpleEntities: async () => {
            return simpleEntityService.getEntities();
        },
        simpleEntitiesCSV: async () => {
            const entities = await simpleEntityService.getEntities();
            const csv = await CSVUtils_1.generateCSV({
                data: entities,
            });
            return csv;
        },
    },
    Mutation: {
        createSimpleEntity: async (_req, { entity }) => {
            return simpleEntityService.createEntity({
                stringField: entity.stringField,
                intField: entity.intField,
                enumField: entity.enumField,
                stringArrayField: entity.stringArrayField,
                boolField: entity.boolField,
            });
        },
        updateSimpleEntity: async (_req, { id, entity }) => {
            return simpleEntityService.updateEntity(id, {
                stringField: entity.stringField,
                intField: entity.intField,
                enumField: entity.enumField,
                stringArrayField: entity.stringArrayField,
                boolField: entity.boolField,
            });
        },
        deleteSimpleEntity: async (_req, { id }) => {
            return simpleEntityService.deleteEntity(id);
        },
    },
};
exports.default = entityResolvers;
