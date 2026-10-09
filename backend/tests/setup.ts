import { toTestDatabaseUrl } from "./testDatabase";

// Loaded before every test file (and by pushTestSchema.ts), so the
// Prisma client only ever connects to the test database.
process.env.DATABASE_URL = toTestDatabaseUrl(process.env.DATABASE_URL);
