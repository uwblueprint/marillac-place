"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const multer_1 = __importDefault(require("multer"));
const util_1 = require("../../middlewares/validators/util");
const entityService_1 = __importDefault(require("../../services/implementations/entityService"));
const fileStorageService_1 = __importDefault(require("../../services/implementations/fileStorageService"));
const CSVUtils_1 = require("../../utilities/CSVUtils");
const defaultBucket = process.env.FIREBASE_STORAGE_DEFAULT_BUCKET || "";
const fileStorageService = new fileStorageService_1.default(defaultBucket);
const entityService = new entityService_1.default(fileStorageService);
multer_1.default({ dest: "uploads/" });
const writeFile = (readStream, filePath) => {
    return new Promise((resolve, reject) => {
        const out = fs_1.default.createWriteStream(filePath);
        readStream.pipe(out);
        out.on("finish", () => {
            resolve();
        });
        out.on("error", (err) => reject(err));
    });
};
const entityResolvers = {
    Query: {
        entity: async (_req, { id }) => {
            return entityService.getEntity(id);
        },
        entities: async () => {
            return entityService.getEntities();
        },
        entitiesCSV: async () => {
            const entities = await entityService.getEntities();
            const csv = await CSVUtils_1.generateCSV({ data: entities });
            return csv;
        },
        file: async (_req, { fileUUID }) => {
            return fileStorageService.getFile(fileUUID);
        },
    },
    Mutation: {
        createEntity: async (_req, { entity, file }) => {
            let filePath = "";
            let fileContentType = "";
            if (file) {
                const { createReadStream, mimetype, filename } = await file;
                const uploadDir = "uploads";
                filePath = `${uploadDir}/${filename}`;
                fileContentType = mimetype;
                if (!util_1.validateFileType(fileContentType)) {
                    throw new Error(util_1.getFileTypeValidationError(fileContentType));
                }
                await writeFile(createReadStream(), filePath);
            }
            const newEntity = await entityService.createEntity({
                stringField: entity.stringField,
                intField: entity.intField,
                enumField: entity.enumField,
                stringArrayField: entity.stringArrayField,
                boolField: entity.boolField,
                filePath,
                fileContentType,
            });
            if (filePath) {
                fs_1.default.unlinkSync(filePath);
            }
            return newEntity;
        },
        updateEntity: async (_req, { id, entity, file, }) => {
            let filePath = "";
            let fileContentType = "";
            if (file) {
                const { createReadStream, mimetype, filename } = await file;
                const uploadDir = "uploads";
                filePath = `${uploadDir}/${filename}`;
                fileContentType = mimetype;
                if (!util_1.validateFileType(fileContentType)) {
                    throw new Error(util_1.getFileTypeValidationError(fileContentType));
                }
                await writeFile(createReadStream(), filePath);
            }
            const updatedEntity = await entityService.updateEntity(id, {
                stringField: entity.stringField,
                intField: entity.intField,
                enumField: entity.enumField,
                stringArrayField: entity.stringArrayField,
                boolField: entity.boolField,
                filePath,
                fileContentType,
            });
            if (filePath) {
                fs_1.default.unlinkSync(filePath);
            }
            return updatedEntity;
        },
        deleteEntity: async (_req, { id }) => {
            return entityService.deleteEntity(id);
        },
    },
};
exports.default = entityResolvers;
