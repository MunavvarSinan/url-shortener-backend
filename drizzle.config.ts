import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
import { config } from './src/shared/config'
export default defineConfig({
  out: './migrations',
  schema: './src/infrastructure/database/schema/index.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: config.database.url,
  },
  verbose: true,
  strict: true,
});
