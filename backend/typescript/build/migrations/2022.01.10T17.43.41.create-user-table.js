"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const TABLE_NAME = "users";
const up = async ({ context: sequelize }) => {
    await sequelize.getQueryInterface().createTable(TABLE_NAME, {
        id: {
            type: sequelize_typescript_1.DataType.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        first_name: {
            type: sequelize_typescript_1.DataType.STRING,
            allowNull: false,
        },
        last_name: {
            type: sequelize_typescript_1.DataType.STRING,
            allowNull: false,
        },
        auth_id: {
            type: sequelize_typescript_1.DataType.STRING,
            allowNull: false,
        },
        role: {
            type: sequelize_typescript_1.DataType.ENUM("User", "Admin"),
            allowNull: false,
        },
        createdAt: sequelize_typescript_1.DataType.DATE,
        updatedAt: sequelize_typescript_1.DataType.DATE,
    });
};
exports.up = up;
const down = async ({ context: sequelize }) => {
    await sequelize.getQueryInterface().dropTable(TABLE_NAME);
};
exports.down = down;
