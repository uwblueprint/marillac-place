"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_admin_1 = require("firebase-admin");
const errorUtils_1 = require("../../utilities/errorUtils");
const logger_1 = __importDefault(require("../../utilities/logger"));
const Logger = logger_1.default(__filename);
class FileStorageService {
    constructor(bucketName) {
        this.bucketName = bucketName;
    }
    async getFile(fileName, expirationTimeMinutes = 60) {
        const bucket = firebase_admin_1.storage().bucket(this.bucketName);
        const expirationDate = new Date();
        expirationDate.setMinutes(expirationDate.getMinutes() + expirationTimeMinutes);
        try {
            const currentBlob = await bucket.file(fileName);
            if (!(await currentBlob.exists())[0]) {
                throw new Error(`File name ${fileName} does not exist`);
            }
            const res = await currentBlob.getSignedUrl({
                action: "read",
                expires: expirationDate,
            });
            return res[0];
        }
        catch (error) {
            Logger.error(`Failed to retrieve file. Reason = ${errorUtils_1.getErrorMessage(error)}`);
            throw error;
        }
    }
    async createFile(fileName, filePath, contentType = null) {
        try {
            const bucket = firebase_admin_1.storage().bucket(this.bucketName);
            const currentBlob = await bucket.file(fileName);
            if ((await currentBlob.exists())[0]) {
                throw new Error(`File name ${fileName} already exists`);
            }
            await bucket.upload(filePath, {
                destination: fileName,
                metadata: { contentType },
            });
        }
        catch (error) {
            Logger.error(`Failed to upload file. Reason = ${errorUtils_1.getErrorMessage(error)}`);
            throw error;
        }
    }
    async updateFile(fileName, filePath, contentType = null) {
        try {
            const bucket = firebase_admin_1.storage().bucket(this.bucketName);
            const currentBlob = await bucket.file(fileName);
            if (!(await currentBlob.exists())[0]) {
                throw new Error(`File name ${fileName} does not exist`);
            }
            await bucket.upload(filePath, {
                destination: fileName,
                metadata: { contentType },
            });
        }
        catch (error) {
            Logger.error(`Failed to update file. Reason = ${errorUtils_1.getErrorMessage(error)}`);
            throw error;
        }
    }
    async deleteFile(fileName) {
        try {
            const bucket = firebase_admin_1.storage().bucket(this.bucketName);
            const currentBlob = await bucket.file(fileName);
            if (!currentBlob) {
                throw new Error(`File name ${fileName} does not exist`);
            }
            await currentBlob.delete();
        }
        catch (error) {
            Logger.error(`Failed to delete file. Reason = ${errorUtils_1.getErrorMessage(error)}`);
            throw error;
        }
    }
}
exports.default = FileStorageService;
