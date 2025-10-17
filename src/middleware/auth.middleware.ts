import type { Request, Response, NextFunction } from "express";
import status from "http-status";

import { verifyToken, type JwtPayload } from "@/utils/jwt.js";
import { logger } from "@/config/index.js";
import { UserSchemas } from "@/schema/index.js";

// Extend the Express Request type to include a user property
declare global {
  namespace Express {
    interface Request {
      jwt?: JwtPayload;
    }
  }
}

/**
 * Middleware to protect routes based on user roles.
 * @param roles Array of roles that are allowed to access the route.
 * @returns Middleware function that checks the JWT and user role.
 */
export const restrictTo = (roles: UserSchemas.Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ") ||
      authHeader.split(" ").length !== 2
    ) {
      logger.warn("Auth error: No token provided or malformed header.");
      res
        .status(status.UNAUTHORIZED)
        .json({ message: "Authentication required." });
      return;
    }
    const token = authHeader.split(" ")[1]!;
    const payload = verifyToken(token);
    if (!payload) {
      logger.warn("Auth error: Invalid or expired token.");
      res.clearCookie("jwt");
      res
        .status(status.UNAUTHORIZED)
        .json({ message: "Invalid or expired token." });
      return;
    }

    // Check if the user has the required role
    if (roles.length > 0 && payload.role && !roles.includes(payload.role)) {
      logger.warn(
        `Auth error: User role '${payload.role}' not authorized for route: ${req.originalUrl}.`
      );
      res.status(status.FORBIDDEN).json({
        message:
          "Forbidden: You do not have permission to access this resource.",
      });
      return;
    }
    req.jwt = payload;
    next();
  };
};

export const restrictFromPublic = restrictTo([]); // No role restriction, just authentication

/**
 * Middleware to restrict access from specified roles.
 */
export const restrictFrom = (roles: UserSchemas.Role[]) => {
  const allRoles = Object.values(UserSchemas.Roles);
  const disallowedRoles = allRoles.filter((role) => !roles.includes(role));
  return restrictTo(disallowedRoles);
};
