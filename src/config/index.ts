/**
 * This file serves as a central "barrel" for all application configurations.
 * It imports configuration settings from individual files and exports them
 * from a single, convenient location. This simplifies imports in other
 * parts of the application and keeps the codebase clean and organized.
 */

import { env } from "./server.config.js";
import { logger } from "./logger.config.js";
import { connectToRedis, disconnectFromRedis } from "./redis.config.js";
import { connectDB } from "./mongoose.config.js";

/**
 * Re-export all configurations.
 * This allows other files in the application to import multiple
 * configuration objects from a single line:
 *
 * `import { env, logger, connectToRedis } from '../config';`
 */
export { env, logger, connectToRedis, disconnectFromRedis, connectDB };
