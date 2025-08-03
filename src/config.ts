import { z } from 'zod';

// Define the schema for your environment variables
const envSchema = z.object({
  PORT: z.coerce.number().min(1, { message: "Port must be a positive number." }).default(3000),
  REDIS_URL: z.url({ message: "REDIS_URL must be a valid URL." }),
});

// Parse and validate the environment variables
const result = envSchema.safeParse(process.env);

// Check for validation errors
if (!result.success) {
  console.error("❌ Invalid environment variables:", result.error.format());
  throw new Error("Invalid environment variables. Please check your .env file.");
}

// Export the parsed, validated, and type-safe environment variables
export const env = result.data;