import type { Request, Response, NextFunction } from "express";

import { verifyToken, type JwtPayload } from "@/utils/jwt.js";
import { logger } from "@/config/index.js";
import { UserSchemas } from "@/schema/index.js";

import { getUser } from "@/api/v1/modules/user/user.repository.js";
import type { IUser } from "@/models/user.model.js";
import type { Role } from "@/schema/user.schema.js";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
      currentRole?: Role;
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
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const authHeader = req.headers.authorization;
    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ") ||
      authHeader.split(" ").length !== 2
    ) {
      logger.warn("Auth error: No token provided or malformed header.");
      return next(new Error("Authentication required."));
    }
    const token = authHeader.split(" ")[1]!;
    const payload = verifyToken(token);
    if (!payload) {
      logger.warn("Auth error: Invalid or expired token.");
      res.clearCookie("jwt");
      return next(new Error("Invalid or expired token."));
    }

    // Check if the user has the required role
    if (roles.length > 0 && payload.role && !roles.includes(payload.role)) {
      logger.warn(
        `Auth error: User role '${payload.role}' not authorized for route: ${req.originalUrl}.`
      );
      return next(
        new Error(
          "Forbidden: You do not have permission to access this resource."
        )
      );
    }

    const user = await getUser({ id: payload.id });

    if (!user) {
      logger.warn(`Auth error: User not found for ID: ${payload.id}.`);
      return next(new Error("User not found."));
    }

    if (!payload.role || !user.roles.includes(payload.role)) {
      logger.warn(
        `Auth error: User role '${payload.role}' not valid for user ID: ${payload.id}.`
      );
      return next(
        new Error(
          "Forbidden: You do not have permission to access this resource."
        )
      );
    }

    req.currentRole = payload.role;
    req.user = user;
    req.jwt = payload;
    next();
  };
};

export const restrictFromPublic = restrictTo([]); // No role restriction, just authentication

/**
 * Middleware to restrict access from specified roles.
 */
export const restrictFrom = (disallowedRoles: UserSchemas.Role[]) => {
  const allRoles = Object.values(UserSchemas.Roles);
  const allowedRoles = allRoles.filter(
    (role) => !disallowedRoles.includes(role)
  );
  return restrictTo(allowedRoles);
};
