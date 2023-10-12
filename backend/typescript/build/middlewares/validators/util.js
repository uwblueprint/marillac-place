"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFileTypeValidationError = exports.getApiValidationError = exports.validateFileType = exports.validateArray = exports.validatePrimitive = void 0;
const allowableContentTypes = new Set([
    "text/plain",
    "application/pdf",
    "image/png",
    "image/jpeg",
    "image/gif",
]);
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
const validatePrimitive = (value, type) => {
    if (value === undefined || value === null)
        return false;
    switch (type) {
        case "string": {
            return typeof value === "string";
        }
        case "boolean": {
            return typeof value === "boolean";
        }
        case "integer": {
            return typeof value === "number" && Number.isInteger(value);
        }
        default: {
            return false;
        }
    }
};
exports.validatePrimitive = validatePrimitive;
const validateArray = (value, type) => {
    return (value !== undefined &&
        value !== null &&
        typeof value === "object" &&
        Array.isArray(value) &&
        value.every((item) => exports.validatePrimitive(item, type)));
};
exports.validateArray = validateArray;
const validateFileType = (mimetype) => {
    return allowableContentTypes.has(mimetype);
};
exports.validateFileType = validateFileType;
const getApiValidationError = (fieldName, type, isArray = false) => {
    return `The ${fieldName} is not a ${type}${isArray ? " Array" : ""}`;
};
exports.getApiValidationError = getApiValidationError;
const getFileTypeValidationError = (mimetype) => {
    const allowableContentTypesString = [...allowableContentTypes].join(", ");
    return `The file type ${mimetype} is not one of ${allowableContentTypesString}`;
};
exports.getFileTypeValidationError = getFileTypeValidationError;
