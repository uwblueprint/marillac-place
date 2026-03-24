import { Pool } from "pg";

const databaseUrl =
  process.env.E2E_DATABASE_URL ??
  "postgresql://postgres:postgres@localhost:5432/mp";

const pool = new Pool({
  connectionString: databaseUrl,
});

export async function queryDb<T = Record<string, unknown>>(
  text: string,
  params: unknown[] = []
) {
  return pool.query<T>(text, params);
}

export async function closeDbPool() {
  await pool.end();
}
