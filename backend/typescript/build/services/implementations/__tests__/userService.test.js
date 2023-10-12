"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const user_model_1 = __importDefault(require("../../../models/user.model"));
const userService_1 = __importDefault(require("../userService"));
const testDb_1 = require("../../../testUtils/testDb");
const testUsers = [
    {
        firstName: "Peter",
        lastName: "Pan",
        authId: "123",
        role: "Admin",
    },
    {
        firstName: "Wendy",
        lastName: "Darling",
        authId: "321",
        role: "User",
    },
];
jest.mock("firebase-admin", () => {
    const auth = jest.fn().mockReturnValue({
        getUser: jest.fn().mockReturnValue({ email: "test@test.com" }),
    });
    return { auth };
});
describe("pg userService", () => {
    let userService;
    beforeEach(async () => {
        await testDb_1.testSql.sync({ force: true });
        userService = new userService_1.default();
    });
    afterAll(async () => {
        await testDb_1.testSql.sync({ force: true });
        await testDb_1.testSql.close();
    });
    it("getUsers", async () => {
        const users = testUsers.map((user) => {
            const userSnakeCase = {};
            Object.entries(user).forEach(([key, value]) => {
                userSnakeCase[lodash_1.snakeCase(key)] = value;
            });
            return userSnakeCase;
        });
        await user_model_1.default.bulkCreate(users);
        const res = await userService.getUsers();
        res.forEach((user, i) => {
            expect(user.firstName).toEqual(testUsers[i].firstName);
            expect(user.lastName).toEqual(testUsers[i].lastName);
            expect(user.role).toEqual(testUsers[i].role);
        });
    });
});
