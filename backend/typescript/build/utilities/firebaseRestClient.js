"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
const logger_1 = __importDefault(require("./logger"));
const Logger = logger_1.default(__filename);
const FIREBASE_SIGN_IN_URL = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword";
const FIREBASE_REFRESH_TOKEN_URL = "https://securetoken.googleapis.com/v1/token";
const FIREBASE_OAUTH_SIGN_IN_URL = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithIdp";
const FirebaseRestClient = {
    // Docs: https://firebase.google.com/docs/reference/rest/auth/#section-sign-in-email-password
    signInWithPassword: async (email, password) => {
        const response = await node_fetch_1.default(`${FIREBASE_SIGN_IN_URL}?key=${process.env.FIREBASE_WEB_API_KEY}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                password,
                returnSecureToken: true,
            }),
        });
        const responseJson = await response.json();
        if (!response.ok) {
            const errorMessage = [
                "Failed to sign-in via Firebase REST API, status code =",
                `${response.status},`,
                "error message =",
                responseJson.error.message,
            ];
            Logger.error(errorMessage.join(" "));
            throw new Error("Failed to sign-in via Firebase REST API");
        }
        return {
            accessToken: responseJson.idToken,
            refreshToken: responseJson.refreshToken,
        };
    },
    // Docs: https://firebase.google.com/docs/reference/rest/auth/#section-sign-in-with-oauth-credential
    signInWithGoogleOAuth: async (idToken) => {
        const response = await node_fetch_1.default(`${FIREBASE_OAUTH_SIGN_IN_URL}?key=${process.env.FIREBASE_WEB_API_KEY}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                postBody: `id_token=${idToken}&providerId=google.com`,
                requestUri: process.env.FIREBASE_REQUEST_URI,
                returnIdpCredential: true,
                returnSecureToken: true,
            }),
        });
        const responseJson = await response.json();
        if (!response.ok) {
            const errorMessage = [
                "Failed to sign-in via Firebase REST API with OAuth, status code =",
                `${response.status},`,
                "error message =",
                responseJson.error.message,
            ];
            Logger.error(errorMessage.join(" "));
            throw new Error("Failed to sign-in via Firebase REST API");
        }
        return responseJson;
    },
    // Docs: https://firebase.google.com/docs/reference/rest/auth/#section-refresh-token
    refreshToken: async (refreshToken) => {
        const response = await node_fetch_1.default(`${FIREBASE_REFRESH_TOKEN_URL}?key=${process.env.FIREBASE_WEB_API_KEY}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: `grant_type=refresh_token&refresh_token=${refreshToken}`,
        });
        const responseJson = await response.json();
        if (!response.ok) {
            const errorMessage = [
                "Failed to refresh token via Firebase REST API, status code =",
                `${response.status},`,
                "error message =",
                responseJson.error.message,
            ];
            Logger.error(errorMessage.join(" "));
            throw new Error("Failed to refresh token via Firebase REST API");
        }
        return {
            accessToken: responseJson.id_token,
            refreshToken: responseJson.refresh_token,
        };
    },
};
exports.default = FirebaseRestClient;
