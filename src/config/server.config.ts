import { z } from "zod";
import ms from "ms";

/*
 * This file should NOT use logger, as it will create a circular dependency.
 */

/**
 * Creates a Zod schema for a duration value.
 * The schema accepts either a string (e.g., "7d", "1h") or a number (milliseconds).
 * The default value is converted to milliseconds and used if no value is provided.
 *
 * @param defaultValue The default duration value (string or number).
 * @returns A Zod schema for the duration.
 */

export function durationSchema(defaultValue: string | number) {
  const defaultMs = // @ts-ignore: ms() returns number | undefined, but we handle errors below
    typeof defaultValue === "number" ? defaultValue : ms(defaultValue);
  if (typeof defaultMs !== "number" || defaultMs <= 0) {
    throw new Error("Invalid default duration value.");
  }

  return z.preprocess((val) => {
    if (typeof val === "string") {
      const valNum = Number(val); // Check if it's a numeric string, i.e, the number of seconds. we don't want to convert to milliseconds here
      if (!isNaN(valNum) && valNum > 0) {
        return valNum; // If it's a valid positive number string, return as number
      }
      // @ts-ignore: ms() returns number | undefined, but we handle errors below
      const duration = ms(val);
      if (typeof duration !== "number" || duration <= 0) {
        throw new Error(
          'Value must be a valid duration string (e.g., "7d", "1h")'
        );
      }
      return duration / 1000; // Convert to seconds
    } else if (typeof val === "number" && val > 0) {
      return val;
    }
    throw new Error('Value must be a string like "7d" or a positive number.');
  }, z.number().default(defaultMs));
}

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().default(3000),
  REDIS_URL: z.string().min(1, "REDIS_URL is required"),
  DATABASE_URL: z.url("DATABASE_URL must be a valid URL"),
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
  REFRESH_TOKEN_SECRET: z.string().min(1, "REFRESH_TOKEN_SECRET is required"),
  REFRESH_TOKEN_EXPIRY: durationSchema("7d"),
  JWT_EXPIRY: durationSchema("15m"),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("❌ Invalid environment variables:", parsedEnv.error.format());
  throw new Error("Invalid environment variables. Check your .env file.");
}

/**
 * Environment variables parsed and validated.
 */
export const env = parsedEnv.data;
