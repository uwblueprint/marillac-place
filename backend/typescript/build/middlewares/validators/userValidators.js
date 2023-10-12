"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserDtoValidator = exports.createUserDtoValidator = void 0;
const util_1 = require("./util");
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
const createUserDtoValidator = async (req, res, next) => {
    if (!util_1.validatePrimitive(req.body.firstName, "string")) {
        return res.status(400).send(util_1.getApiValidationError("firstName", "string"));
    }
    if (!util_1.validatePrimitive(req.body.lastName, "string")) {
        return res.status(400).send(util_1.getApiValidationError("lastName", "string"));
    }
    if (!util_1.validatePrimitive(req.body.email, "string")) {
        return res.status(400).send(util_1.getApiValidationError("email", "string"));
    }
    if (!util_1.validatePrimitive(req.body.role, "string")) {
        return res.status(400).send(util_1.getApiValidationError("role", "string"));
    }
    if (!util_1.validatePrimitive(req.body.password, "string")) {
        return res.status(400).send(util_1.getApiValidationError("password", "string"));
    }
    return next();
};
exports.createUserDtoValidator = createUserDtoValidator;
const updateUserDtoValidator = async (req, res, next) => {
    if (!util_1.validatePrimitive(req.body.firstName, "string")) {
        return res.status(400).send(util_1.getApiValidationError("firstName", "string"));
    }
    if (!util_1.validatePrimitive(req.body.lastName, "string")) {
        return res.status(400).send(util_1.getApiValidationError("lastName", "string"));
    }
    if (!util_1.validatePrimitive(req.body.email, "string")) {
        return res.status(400).send(util_1.getApiValidationError("email", "string"));
    }
    if (!util_1.validatePrimitive(req.body.role, "string")) {
        return res.status(400).send(util_1.getApiValidationError("role", "string"));
    }
    return next();
};
exports.updateUserDtoValidator = updateUserDtoValidator;
