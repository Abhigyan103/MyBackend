// src/cache/refreshToken.cache.ts
import { connectToRedis, env } from "@/config/index.js";
import {
  signRefreshToken,
  verifyRefreshToken,
  type JwtPayload,
} from "@/utils/jwt.js";

const redisClient = await connectToRedis();

/**
 * Creates and stores a refresh token in Redis.
 * @param userId The ID of the user associated with the token.
 * @returns The generated refresh token string.
 */
export const createRefreshToken = async (
  payload: JwtPayload
): Promise<string> => {
  const refreshToken = signRefreshToken(payload);
  const key = getRefreshCacheKey(payload.id);
  await redisClient.set(key, refreshToken, { EX: env.REFRESH_TOKEN_EXPIRY });

  return refreshToken;
};

/**
 * Validates a refresh token against the one stored in Redis.
 * @param token The refresh token to validate.
 * @returns boolean indicating if the token is valid.
 */
export const validateRefreshToken = async (token: string): Promise<boolean> => {
  const payload = verifyRefreshToken(token);
  if (!payload) return false;

  const storedToken = await redisClient.get(getRefreshCacheKey(payload.id));
  return storedToken === token;
};

/**
 * Deletes a refresh token from Redis.
 * Used for logout or when a refresh token is compromised.
 * @param userId The ID of the user.
 */
export const invalidateRefreshToken = async (userId: string): Promise<void> => {
  await redisClient.del(getRefreshCacheKey(userId));
};

const getRefreshCacheKey = (userId: string): string => {
  return `my_backend:refresh_token:${userId}`;
};
