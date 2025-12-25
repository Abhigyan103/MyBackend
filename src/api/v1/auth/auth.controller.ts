import type { NextFunction, Request, Response } from "express";
import status from "http-status";
import { MongoServerError } from "mongodb";
import { ZodError } from "zod";

import {
  createRefreshToken,
  validateRefreshToken,
} from "@/cache/refreshToken.cache.js";
import { env, logger } from "@/config/index.js";
import * as authService from "@/modules/account/service/auth.service.js";
import {
  signToken,
  verifyRefreshToken,
  type JwtPayload,
} from "@/modules/account/utils/jwt.js";
import { CustomErrorTypes } from "@/types/error.types.js";
import { CustomError, getZodFieldsFromError } from "@/utils/error.js";

import type {
  ChangePasswordRequestBody,
  DeleteAccountRequestBody,
  LoginRequestBody,
  RegisterRequestBody,
} from "./auth.validators.js";

export const register = async (
  req: Request<{}, {}, RegisterRequestBody>,
  res: Response,
  next: NextFunction,
) => {
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
  } catch (error: any) {
    if (error instanceof CustomError) {
      next({
        status: error.status,
        message: error.message,
        stack: error.stack,
      });
      return;
    }
    if (error instanceof ZodError) {
      const invalidFields = getZodFieldsFromError(error);
      next({
        status: status.BAD_REQUEST,
        message: "Invalid input data.",
        stack: error.stack,
        fields: invalidFields,
      });
      return;
    }
    if (error instanceof MongoServerError) {
      if (error.code === 11000) {
        next({
          status: status.CONFLICT,
          fields: Object.keys(error.keyValue).map((key) => ({
            [key]: `${key} already exists.`,
          })),
          message: "Invalid input data.",
        });
        return;
      }
    }
    next({
      status: status.INTERNAL_SERVER_ERROR,
      message: "Server error.",
      stack: error.stack,
    });
  }
};

export const login = async (
  req: Request<{}, {}, LoginRequestBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;

    const user = await authService.authenticateUser({ email }, password);

    if (!user || !user.roles || user.roles.length <= 0) {
      logger.warn(`Login failed for user: ${email}`);
      next({
        status: status.UNAUTHORIZED,
        message: "Invalid credentials.",
      });
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
  } catch (error: any) {
    if (error instanceof CustomError) {
      if (error.type === CustomErrorTypes.InvalidCredentialsError) {
        next({
          status: error.status,
          message: "Invalid email or password.",
          stack: error.stack,
        });
      }
      return;
    }
    next({
      status: status.INTERNAL_SERVER_ERROR,
      message: "Server error.",
      stack: error.stack,
    });
  }
};

/**
 * Controller to handle refresh token requests.
 * Issues a new access token if the refresh token is valid.
 */
export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const refreshToken = req.cookies.jwt;

    if (!refreshToken || typeof refreshToken !== "string") {
      next({
        status: status.UNAUTHORIZED,
        message: "No refresh token provided.",
      });
      return;
    }

    const isValid = await validateRefreshToken(refreshToken);

    if (!isValid) {
      res.clearCookie("jwt");
      next({
        status: status.UNAUTHORIZED,
        message: "Invalid or expired refresh token.",
      });
      return;
    }

    const payload = verifyRefreshToken(refreshToken);
    if (!payload) {
      res.clearCookie("jwt");
      next({
        status: status.UNAUTHORIZED,
        message: "Invalid or expired refresh token.",
      });
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
  } catch (error: any) {
    res.clearCookie("jwt");
    next({
      status: status.INTERNAL_SERVER_ERROR,
      message: "Could not refresh token.",
      stack: error.stack,
    });
  }
};

export const deleteAccount = async (
  req: Request<{}, {}, DeleteAccountRequestBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.id;
    await authService.deleteUser({
      userId: userId,
      password: req.body.password,
    });
    res.clearCookie("jwt");
    res.status(status.NO_CONTENT).send();
  } catch (error: any) {
    res.clearCookie("jwt");
    if (error instanceof CustomError) {
      next({
        status: error.status,
        message: error.message,
        stack: error.stack,
      });
      return;
    }
    next({
      status: status.INTERNAL_SERVER_ERROR,
      message: "Could not delete account.",
      stack: error.stack,
    });
  }
};

export const changePassword = async (
  req: Request<{}, {}, ChangePasswordRequestBody>,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.user!.id;
  const { oldPassword, newPassword } = req.body;

  try {
    await authService.changeUserPassword(userId, oldPassword, newPassword);
    res.status(status.OK).send();
  } catch (error: any) {
    if (error instanceof CustomError) {
      next({
        status: error.status,
        message: error.message,
        stack: error.stack,
      });
      return;
    }
    next({
      status: status.INTERNAL_SERVER_ERROR,
      message: "Could not change password.",
      stack: error.stack,
    });
  }
};
