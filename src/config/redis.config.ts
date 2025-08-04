import { createClient, type RedisClientType } from 'redis';
import { env } from './server.config.js';
import { logger } from './logger.config.js';

let redisClient: RedisClientType;

/**
 * Initializes and connects a Redis client instance.
 * It follows a singleton pattern to ensure only one connection is made.
 * Connection configuration is pulled from environment variables.
 *
 * @returns {Promise<RedisClientType>} The connected Redis client instance.
 */
export const connectToRedis = async (): Promise<RedisClientType> => {
  if (redisClient && redisClient.isReady) {
    logger.info('Redis client is already connected.');
    return redisClient;
  }

  // Redis connection options
  const clientOptions = {
    url: env.REDIS_URL,
  };

  try {
    redisClient = createClient(clientOptions);

    redisClient.on('connect', () => {
      logger.info('Redis client is connecting...');
    });
    
    redisClient.on('ready', () => {
      logger.info('Redis client connected successfully!');
    });

    redisClient.on('error', (err) => {
      logger.error('Redis connection error:', err);
    });

    redisClient.on('end', () => {
      logger.warn('Redis client connection has been closed.');
    });

    // Initiate the connection to Redis
    await redisClient.connect();
    
    return redisClient;
  } catch (error) {
    logger.error('Failed to initialize or connect to Redis client:', error);
    // Propagate the error to the caller
    throw new Error('Could not connect to Redis.');
  }
};

/**
 * Helper function to gracefully disconnect the Redis client.
 * This should be called on application shutdown.
 */
export const disconnectFromRedis = async (): Promise<void> => {
  if (redisClient && redisClient.isReady) {
    await redisClient.quit();
    logger.info('Redis client disconnected gracefully.');
  }
};