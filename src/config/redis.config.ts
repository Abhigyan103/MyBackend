import { createClient, type RedisClientType } from 'redis';
import { env } from './server.config.js'; // Assuming you have an env.config.ts file

// Define the Redis client type for better TypeScript support
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
    console.log('Redis client is already connected.');
    return redisClient;
  }

  // Redis connection options
  const clientOptions = {
    url: env.REDIS_URL,
  };

  try {
    redisClient = createClient(clientOptions);

    redisClient.on('connect', () => {
      console.log('Redis client is connecting...');
    });
    
    redisClient.on('ready', () => {
      console.log('Redis client connected successfully!');
    });

    redisClient.on('error', (err) => {
      console.error('Redis connection error:', err);
    });

    redisClient.on('end', () => {
      console.warn('Redis client connection has been closed.');
    });

    // Initiate the connection to Redis
    await redisClient.connect();
    
    return redisClient;
  } catch (error) {
    console.error('Failed to initialize or connect to Redis client:', error);
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
    console.log('Redis client disconnected gracefully.');
  }
};