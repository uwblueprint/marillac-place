"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRequestValidator = exports.loginRequestValidator = void 0;
const util_1 = require("./util");
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable-next-line import/prefer-default-export */
const loginRequestValidator = async (req, res, next) => {
    if (req.body.idToken) {
        if (!util_1.validatePrimitive(req.body.idToken, "string")) {
            return res.status(400).json(util_1.getApiValidationError("idToken", "string"));
        }
    }
    else {
        if (!util_1.validatePrimitive(req.body.email, "string")) {
            return res.status(400).send(util_1.getApiValidationError("email", "string"));
        }
        if (!util_1.validatePrimitive(req.body.password, "string")) {
            return res.status(400).send(util_1.getApiValidationError("password", "string"));
        }
    }
    return next();
};
exports.loginRequestValidator = loginRequestValidator;
const registerRequestValidator = async (req, res, next) => {
    if (!util_1.validatePrimitive(req.body.firstName, "string")) {
        return res.status(400).send(util_1.getApiValidationError("firstName", "string"));
    }
    if (!util_1.validatePrimitive(req.body.lastName, "string")) {
        return res.status(400).send(util_1.getApiValidationError("lastName", "string"));
    }
    if (!util_1.validatePrimitive(req.body.email, "string")) {
        return res.status(400).send(util_1.getApiValidationError("email", "string"));
    }
    if (!util_1.validatePrimitive(req.body.password, "string")) {
        return res.status(400).send(util_1.getApiValidationError("password", "string"));
    }
    return next();
};
exports.registerRequestValidator = registerRequestValidator;
