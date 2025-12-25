/**
 * This file serves as a central "barrel" for all application configurations.
 * It imports configuration settings from individual files and exports them
 * from a single, convenient location. This simplifies imports in other
 * parts of the application and keeps the codebase clean and organized.
 */

import { s3Client, snsClient, sqsClient } from "./aws.config.js";
import { logger } from "./logger.config.js";
import { client, connectDB, db } from "./mongodb.config.js";
import { connectToRedis } from "./redis.config.js";
import { env, NodeEnv } from "./server.config.js";

const redisClient = await connectToRedis();

/**
 * Re-export all configurations.
 * This allows other files in the application to import multiple
 * configuration objects from a single line:
 *
 * `import { env, logger, redisClient } from '../config';`
 */
export {
  env,
  NodeEnv,
  logger,
  redisClient,
  db,
  client,
  connectDB,
  s3Client,
  snsClient,
  sqsClient,
};
