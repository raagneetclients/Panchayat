import { getDatabase } from '@netlify/database';
import { drizzle } from 'drizzle-orm/node-postgres';
import type { Pool } from 'pg';
import * as schema from './schema';

function createDatabase() {
  const connection = getDatabase();

  // @netlify/database selects the appropriate Postgres driver for the current
  // runtime. Both drivers expose the pg-compatible Pool API used by Drizzle.
  return drizzle(connection.pool as unknown as Pool, { schema });
}

let database: ReturnType<typeof createDatabase> | undefined;

/**
 * Lazily create the Drizzle client so builds that do not touch advertising
 * data do not require a database connection. Netlify injects NETLIFY_DB_URL
 * at build and function runtime.
 */
export function getDb() {
  database ??= createDatabase();
  return database;
}

export type Database = ReturnType<typeof getDb>;
