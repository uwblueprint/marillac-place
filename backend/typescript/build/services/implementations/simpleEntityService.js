"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const simpleEntity_model_1 = __importDefault(require("../../models/simpleEntity.model"));
const errorUtils_1 = require("../../utilities/errorUtils");
const logger_1 = __importDefault(require("../../utilities/logger"));
const Logger = logger_1.default(__filename);
class SimpleEntityService {
    /* eslint-disable class-methods-use-this */
    async getEntity(id) {
        let entity;
        try {
            entity = await simpleEntity_model_1.default.findByPk(id, { raw: true });
            if (!entity) {
                throw new Error(`Entity id ${id} not found`);
            }
        }
        catch (error) {
            Logger.error(`Failed to get entity. Reason = ${errorUtils_1.getErrorMessage(error)}`);
            throw error;
        }
        return {
            id: String(entity.id),
            stringField: entity.string_field,
            intField: entity.int_field,
            enumField: entity.enum_field,
            stringArrayField: entity.string_array_field,
            boolField: entity.bool_field,
        };
    }
    async getEntities() {
        try {
            const entities = await simpleEntity_model_1.default.findAll({
                raw: true,
            });
            return entities.map((entity) => ({
                id: String(entity.id),
                stringField: entity.string_field,
                intField: entity.int_field,
                enumField: entity.enum_field,
                stringArrayField: entity.string_array_field,
                boolField: entity.bool_field,
            }));
        }
        catch (error) {
            Logger.error(`Failed to get entities. Reason = ${errorUtils_1.getErrorMessage(error)}`);
            throw error;
        }
    }
    async createEntity(entity) {
        let newEntity;
        try {
            newEntity = await simpleEntity_model_1.default.create({
                string_field: entity.stringField,
                int_field: entity.intField,
                enum_field: entity.enumField,
                string_array_field: entity.stringArrayField,
                bool_field: entity.boolField,
            });
        }
        catch (error) {
            Logger.error(`Failed to create entity. Reason = ${errorUtils_1.getErrorMessage(error)}`);
            throw error;
        }
        return {
            id: String(newEntity.id),
            stringField: newEntity.string_field,
            intField: newEntity.int_field,
            enumField: newEntity.enum_field,
            stringArrayField: newEntity.string_array_field,
            boolField: newEntity.bool_field,
        };
    }
    async updateEntity(id, entity) {
        let resultingEntity;
        let updateResult;
        try {
            updateResult = await simpleEntity_model_1.default.update({
                string_field: entity.stringField,
                int_field: entity.intField,
                enum_field: entity.enumField,
                string_array_field: entity.stringArrayField,
                bool_field: entity.boolField,
            }, { where: { id }, returning: true });
            if (!updateResult[0]) {
                throw new Error(`Entity id ${id} not found`);
            }
            [, [resultingEntity]] = updateResult;
        }
        catch (error) {
            Logger.error(`Failed to update entity. Reason = ${errorUtils_1.getErrorMessage(error)}`);
            throw error;
        }
        return {
            id: String(resultingEntity.id),
            stringField: resultingEntity.string_field,
            intField: resultingEntity.int_field,
            enumField: resultingEntity.enum_field,
            stringArrayField: resultingEntity.string_array_field,
            boolField: resultingEntity.bool_field,
        };
    }
    async deleteEntity(id) {
        try {
            const deleteResult = await simpleEntity_model_1.default.destroy({
                where: { id },
            });
            if (!deleteResult) {
                throw new Error(`Entity id ${id} not found`);
            }
            return id;
        }
        catch (error) {
            Logger.error(`Failed to delete entity. Reason = ${errorUtils_1.getErrorMessage(error)}`);
            throw error;
        }
    }
}
exports.default = SimpleEntityService;
