"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const errorUtils_1 = require("../../utilities/errorUtils");
const logger_1 = __importDefault(require("../../utilities/logger"));
const Logger = logger_1.default(__filename);
class EmailService {
    constructor(nodemailerConfig, displayName) {
        this.transporter = nodemailer_1.default.createTransport(nodemailerConfig);
        if (displayName) {
            this.sender = `${displayName} <${nodemailerConfig.auth.user}>`;
        }
        else {
            this.sender = nodemailerConfig.auth.user;
        }
    }
    async sendEmail(to, subject, htmlBody) {
        const mailOptions = {
            from: this.sender,
            to,
            subject,
            html: htmlBody,
        };
        try {
            return await this.transporter.sendMail(mailOptions);
        }
        catch (error) {
            Logger.error(`Failed to send email. Reason = ${errorUtils_1.getErrorMessage(error)}`);
            throw error;
        }
    }
}
exports.default = EmailService;
