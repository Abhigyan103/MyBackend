import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),

  // Redis Configuration
  REDIS_URL: z.string().min(1, 'REDIS_URL is required'),

  // Other configurations (e.g., database, external services)
  // DATABASE_URL: z.string().url('DATABASE_URL must be a valid URL'),
  // JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error(
    '❌ Invalid environment variables:',
    parsedEnv.error.format()
  );
  throw new Error('Invalid environment variables. Check your .env file.');
}

/**
 * Environment variables parsed and validated using zod.
 */
export const env = parsedEnv.data;