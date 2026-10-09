import { Prisma, PrismaClient } from "@prisma/client";

// The client a helper writes through: `db`, or a transaction so its writes
// commit or roll back together with the caller's.
export type DbClient = Prisma.TransactionClient;

const db = new PrismaClient();

export default db;
