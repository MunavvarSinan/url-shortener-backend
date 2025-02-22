import pkg from 'pg'; // CommonJS module needs default import
import { drizzle } from 'drizzle-orm/node-postgres';
import { sql } from 'drizzle-orm';
import * as schema from './schema';
import { config } from '@/shared/config';

const { Pool } = pkg; // Destructure Pool from the default import

// Create a connection pool (singleton)
const pool = new Pool({
  connectionString: config.database.url,
});

export const db = drizzle(pool, { schema });

export async function ping(): Promise<unknown> {
  return db.execute(sql`SELECT 1`);
}
