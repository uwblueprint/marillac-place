import * as path from "path";
import { Sequelize } from "sequelize-typescript";

const DATABASE_URL =
  process.env.NODE_ENV === "production"
    ? /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
      process.env.DATABASE_URL!
    : `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.DB_HOST}:5432/${process.env.POSTGRES_DB_DEV}`;

/* eslint-disable-next-line import/prefer-default-export */
export const sequelize = new Sequelize(DATABASE_URL, {
  models: [path.join(__dirname, "/*.model.ts")],
});
