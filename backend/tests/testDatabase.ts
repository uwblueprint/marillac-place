import { PrismaClient } from "@prisma/client";

// Tests that need Postgres use a separate `<name>_test` database on the
// DATABASE_URL server, so resetting it can never touch dev data.
export function toTestDatabaseUrl(databaseUrl: string | undefined): string {
  if (!databaseUrl) throw new Error("DATABASE_URL is not set");
  const url = new URL(databaseUrl);
  const name = url.pathname.slice(1);
  if (!name) throw new Error("DATABASE_URL has no database name");
  // Test files run in child processes that inherit the already-swapped URL.
  if (!name.endsWith("_test")) url.pathname = `/${name}_test`;
  return url.toString();
}

// Empties every table, refusing to run against anything but a test database.
export async function resetDatabase(db: PrismaClient): Promise<void> {
  const [{ name }] = await db.$queryRaw<
    { name: string }[]
  >`SELECT current_database() AS name`;
  if (!name.endsWith("_test")) {
    throw new Error(`refusing to reset non-test database "${name}"`);
  }
  const tables = await db.$queryRaw<{ tablename: string }[]>`
    SELECT tablename FROM pg_tables WHERE schemaname = 'public'`;
  if (tables.length === 0) return;
  const list = tables.map(({ tablename }) => `"${tablename}"`).join(", ");
  await db.$executeRawUnsafe(`TRUNCATE ${list} RESTART IDENTITY CASCADE`);
}
