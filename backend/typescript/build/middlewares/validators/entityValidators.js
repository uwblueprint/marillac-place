"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.entityRequestDtoValidator = void 0;
const util_1 = require("./util");
const errorUtils_1 = require("../../utilities/errorUtils");
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable-next-line import/prefer-default-export */
const entityRequestDtoValidator = async (req, res, next) => {
    let body;
    try {
        body = JSON.parse(req.body.body);
    }
    catch (e) {
        return res.status(400).send(errorUtils_1.getErrorMessage(e));
    }
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
    if (req.file && !util_1.validateFileType(req.file.mimetype)) {
        return res.status(400).send(util_1.getFileTypeValidationError(req.file.mimetype));
    }
    return next();
};
exports.entityRequestDtoValidator = entityRequestDtoValidator;
