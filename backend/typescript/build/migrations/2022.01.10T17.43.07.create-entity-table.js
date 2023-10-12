"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const TABLE_NAME = "entities";
const up = async ({ context: sequelize }) => {
    await sequelize.getQueryInterface().createTable(TABLE_NAME, {
        id: {
            type: sequelize_typescript_1.DataType.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        string_field: {
            type: sequelize_typescript_1.DataType.STRING,
            allowNull: false,
        },
        int_field: {
            type: sequelize_typescript_1.DataType.INTEGER,
            allowNull: false,
        },
        enum_field: {
            type: sequelize_typescript_1.DataType.ENUM("A", "B", "C", "D"),
            allowNull: false,
        },
        string_array_field: {
            type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING),
            allowNull: false,
        },
        bool_field: {
            type: sequelize_typescript_1.DataType.BOOLEAN,
            allowNull: false,
        },
        file_name: {
            type: sequelize_typescript_1.DataType.STRING,
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
