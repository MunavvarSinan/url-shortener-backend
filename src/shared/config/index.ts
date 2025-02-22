import { config as dotenvConfig } from 'dotenv';
import { expand } from 'dotenv-expand';
import { ZodError, z } from 'zod';

dotenvConfig();
expand(dotenvConfig());

const EnvSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.coerce.number().default(3000),
    JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),
    JWT_EXPIRES_IN: z.string().default('1d'),
    RATE_LIMIT_WINDOW_MS: z.coerce.number().default(15 * 60 * 1000), // 15 minutes
    RATE_LIMIT_MAX: z.coerce.number().default(100),
    DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  })
  .passthrough();

export type EnvSchemaType = z.infer<typeof EnvSchema>;

/**
 * Parses and validates environment variables using Zod.
 * Throws an error if required values are missing.
 */
function parseEnv(): EnvSchemaType {
  try {
    return EnvSchema.parse(process.env);
  } catch (error) {
    if (error instanceof ZodError) {
      const missingKeys = error.issues.map((issue) => issue.path.join('.')).join(', ');
      throw new Error(`Missing required environment variables: ${missingKeys}`);
    }
    throw error;
  }
}

const env = parseEnv();

/**
 * Application configuration object with strongly typed values.
 */
const config = {
  nodeEnv: env.NODE_ENV,
  port: env.PORT,
  jwt: {
    secret: env.JWT_SECRET,
    expiresIn: env.JWT_EXPIRES_IN,
  },
  rateLimit: {
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    max: env.RATE_LIMIT_MAX,
  },
  database: {
    url: env.DATABASE_URL,
  },

  isDevelopment: env.NODE_ENV === 'development',
  isProduction: env.NODE_ENV === 'production',
  isTest: env.NODE_ENV === 'test',
} as const;

export { config };
