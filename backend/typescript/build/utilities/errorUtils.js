"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getErrorMessage = void 0;
/* eslint-disable-next-line import/prefer-default-export */
const getErrorMessage = (error) => {
    return error instanceof Error ? error.message : "Unknown error occurred.";
};
exports.getErrorMessage = getErrorMessage;
