import type { Request, Response, NextFunction } from "express";
import status from "http-status";

import { verifyToken, type JwtPayload } from "@/utils/jwt.js";
import { logger } from "@/config/index.js";
import { Role } from "@/types/roles.js";

// Extend the Express Request type to include a user property
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

/**
 * Middleware to protect routes based on user roles.
 * @param roles Array of roles that are allowed to access the route.
 * @returns Middleware function that checks the JWT and user role.
 */
export const protectFor = (roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ") ||
      authHeader.split(" ").length !== 2
    ) {
      logger.warn("Auth error: No token provided or malformed header.");
      return res
        .status(status.UNAUTHORIZED)
        .json({ message: "Authentication required." });
    }
    const token = authHeader.split(" ")[1]!;
    const payload = verifyToken(token);
    if (!payload) {
      logger.warn("Auth error: Invalid or expired token.");
      res.clearCookie("jwt");
      return res
        .status(status.UNAUTHORIZED)
        .json({ message: "Invalid or expired token." });
    }

    // Check if the user has the required role
    if (roles.length > 0 && !roles.includes(payload.role)) {
      logger.warn(
        `Auth error: User role '${payload.role}' not authorized for route: ${req.originalUrl}.`
      );
      return res.status(status.FORBIDDEN).json({
        message:
          "Forbidden: You do not have permission to access this resource.",
      });
    }
    req.user = payload;
    next();
  };
};
