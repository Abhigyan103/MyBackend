import jwt from "jsonwebtoken";
import { env, logger } from "../config/index.js";
import type { UserSchemas } from "@/schema/index.js";

export interface JwtPayload {
  id: string;
  role: UserSchemas.Role;
}

export const signToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRY,
  });
};

export const signRefreshToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, env.REFRESH_TOKEN_SECRET, {
    expiresIn: env.REFRESH_TOKEN_EXPIRY,
  });
};

export const verifyToken = (token: string): JwtPayload | null => {
  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    return payload;
  } catch (error) {
    logger.error(`Token verification failed: ${error}`);
    return null;
  }
};

export const verifyRefreshToken = (token: string): JwtPayload | null => {
  try {
    const payload = jwt.verify(token, env.REFRESH_TOKEN_SECRET) as JwtPayload;
    if (!payload) {
      throw new Error("Invalid refresh token");
    }
    return payload;
  } catch (error) {
    logger.error(`Refresh token verification failed: ${error}`);
    return null;
  }
};

export const generateJwtFromRefresh = (refreshToken: string): string | null => {
  const payload = verifyRefreshToken(refreshToken);
  if (!payload) return null;

  return signToken(payload);
};
