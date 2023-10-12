"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.simpleEntityRequestDtoValidator = void 0;
const util_1 = require("./util");
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable-next-line import/prefer-default-export */
const simpleEntityRequestDtoValidator = async (req, res, next) => {
    const { body } = req;
    if (!util_1.validatePrimitive(body.stringField, "string")) {
        return res.status(400).send(util_1.getApiValidationError("stringField", "string"));
    }
    if (!util_1.validatePrimitive(body.intField, "integer")) {
        return res.status(400).send(util_1.getApiValidationError("intField", "integer"));
    }
    if (!util_1.validatePrimitive(body.enumField, "string")) {
        return res.status(400).send(util_1.getApiValidationError("enumField", "string"));
    }
    if (!util_1.validateArray(body.stringArrayField, "string")) {
        return res
            .status(400)
            .send(util_1.getApiValidationError("stringArrayField", "string", true));
    }
    if (!util_1.validatePrimitive(body.boolField, "boolean")) {
        return res.status(400).send(util_1.getApiValidationError("boolField", "boolean"));
    }
    return next();
};
exports.simpleEntityRequestDtoValidator = simpleEntityRequestDtoValidator;
