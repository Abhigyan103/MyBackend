import type { NextFunction, Request, Response } from "express";
import status from "http-status";

import { signToken, verifyRefreshToken, type JwtPayload } from "@/utils/jwt.js";
import {
  createRefreshToken,
  validateRefreshToken,
} from "@/cache/refreshToken.cache.js";
import { env, logger } from "@/config/index.js";

import * as authService from "./auth.service.js";

export const register = async (req: Request, res: Response) => {
  if (!req.body || !req.body.email || !req.body.password) {
    res
      .status(status.BAD_REQUEST)
      .json({ message: "Email and password are required." });
    return;
  }
  const { email, password } = req.body;

  try {
    const user = await authService.registerUser(email, password);
    const payload: JwtPayload = {
      id: user.id,
      role: user.roles[0]!, // Assuming the first role is the primary role
    };
    const accessToken = signToken(payload);
    const refreshToken = await createRefreshToken(payload);

    logger.info(`User logged in successfully: ${user.id}`);

    res.cookie("jwt", refreshToken, {
      httpOnly: true, // Prevents client-side JS access (XSS mitigation)
      secure: env.NODE_ENV === "production", // Use 'secure' in production
      sameSite: "strict", // CSRF mitigation
      maxAge: env.REFRESH_TOKEN_EXPIRY * 1000, // Convert to milliseconds
    });

    res.status(status.CREATED).json({ accessToken });
  } catch (error) {
    logger.error(`Registration error for user ${email}: ${error}`);
    res.status(status.INTERNAL_SERVER_ERROR).json({ message: "Server error." });
  }
};

export const login = async (req: Request, res: Response) => {
  if (!req.body || !req.body.email || !req.body.password) {
    res
      .status(status.BAD_REQUEST)
      .json({ message: "Email and password are required." });
    return;
  }
  const { email, password } = req.body;

  const user = await authService.authenticateUser({ email }, password);

  if (!user || !user.roles || user.roles.length <= 0) {
    logger.warn(`Login failed for user: ${email}`);
    res.status(status.UNAUTHORIZED).json({ message: "Invalid credentials." });
    return;
  }

  const payload: JwtPayload = {
    id: user.id,
    role: user.roles[0]!, // Assuming the first role is the primary role
  };
  const accessToken = signToken(payload);
  const refreshToken = await createRefreshToken(payload);

  logger.info(`User logged in successfully: ${user.id}`);

  res.cookie("jwt", refreshToken, {
    httpOnly: true, // Prevents client-side JS access (XSS mitigation)
    secure: env.NODE_ENV === "production", // Use 'secure' in production
    sameSite: "strict", // CSRF mitigation
    maxAge: env.REFRESH_TOKEN_EXPIRY * 1000, // Convert to milliseconds
  });

  res.status(status.OK).json({
    accessToken,
  });
};

/**
 * Controller to handle refresh token requests.
 * Issues a new access token if the refresh token is valid.
 */
export const refreshToken = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.jwt;

    if (!refreshToken) {
      res.status(status.UNAUTHORIZED).json({ message: "Invalid request." });
      return;
    }

    const isValid = await validateRefreshToken(refreshToken);

    if (!isValid) {
      logger.warn(`Refresh token failed.`);
      res.clearCookie("jwt");
      res
        .status(status.UNAUTHORIZED)
        .json({ message: "Invalid or expired refresh token." });
      return;
    }

    const payload = verifyRefreshToken(refreshToken);
    if (!payload) {
      logger.warn(`Refresh token verification failed.`);
      res
        .status(status.UNAUTHORIZED)
        .json({ message: "Invalid or expired refresh token." });
      return;
    }

    const newAccessToken = signToken({
      id: payload.id,
      role: payload.role,
    });
    const newRefreshToken = await createRefreshToken({
      id: payload.id,
      role: payload.role,
    });

    logger.info(`New access token issued for user: ${payload.id}`);

    res.cookie("jwt", newRefreshToken, {
      httpOnly: true, // Prevents client-side JS access (XSS mitigation)
      secure: env.NODE_ENV === "production", // Use 'secure' in production
      sameSite: "strict", // CSRF mitigation
      maxAge: env.REFRESH_TOKEN_EXPIRY,
    });

    res.status(status.OK).json({
      accessToken: newAccessToken,
    });
  } catch (error) {
    logger.error(`Error in refreshToken controller: ${error}`);
    res.clearCookie("jwt");
    res.status(status.INTERNAL_SERVER_ERROR).json({ message: "Server error." });
  }
};
