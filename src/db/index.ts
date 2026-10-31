import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { PGlite } from '@electric-sql/pglite';
import { drizzle as localDrizzle, type PgliteDatabase } from 'drizzle-orm/pglite';
import { drizzle as pgDrizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import { migrations } from './migrations';

type Database = PgliteDatabase<typeof schema>;
type Connection = {
  db: Database;
  run: (query: string) => Promise<unknown>;
  close: () => Promise<void>;
};
const state = globalThis as typeof globalThis & { labsprintDb?: Promise<Connection> };

async function connect(): Promise<Connection> {
  if (process.env.DATABASE_URL) {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 3,
      idleTimeoutMillis: 20_000,
      connectionTimeoutMillis: 15_000,
    });
    return {
      db: pgDrizzle(pool, { schema }) as unknown as Database,
      run: (query) => pool.query(query),
      close: () => pool.end(),
    };
  }
  if (process.env.VERCEL)
    throw new Error('DATABASE_URL is required on Vercel. Local database fallback is disabled.');
  const dataDir = resolve(process.env.LABSPRINT_DATA_DIR || '.data');
  mkdirSync(dataDir, { recursive: true });
  const client = new PGlite(resolve(dataDir, 'db'));
  await client.waitReady;
  const connection = {
    db: localDrizzle(client, { schema }),
    run: (query: string) => client.exec(query),
    close: () => client.close(),
  };
  try {
    await migrateConnection(connection, false);
  } catch (error) {
    await client.close();
    throw error;
  }
  return connection;
}

export async function getConnection() {
  state.labsprintDb ??= connect().catch((error) => {
    delete state.labsprintDb;
    throw error;
  });
  return state.labsprintDb;
}

async function migrateConnection(connection: Connection, postgres: boolean) {
  // One SQL request keeps transaction + advisory lock on the same pg connection.
  await connection.run(`BEGIN; ${postgres ? 'SELECT pg_advisory_xact_lock(54922015);' : ''}
    CREATE TABLE IF NOT EXISTS schema_version (version integer PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now());
    ${migrations
      .map(
        (
          m,
        ) => `DO $migration$ BEGIN IF NOT EXISTS (SELECT 1 FROM schema_version WHERE version = ${m.version}) THEN
      ${m.sql} INSERT INTO schema_version(version) VALUES (${m.version}); END IF; END $migration$;`,
      )
      .join('\n')}
    COMMIT;`);
}

export async function migrate() {
  await migrateConnection(await getConnection(), Boolean(process.env.DATABASE_URL));
}
export async function getDb() {
  return (await getConnection()).db;
}
export async function closeDb() {
  const connection = await state.labsprintDb;
  delete state.labsprintDb;
  await connection?.close();
}
