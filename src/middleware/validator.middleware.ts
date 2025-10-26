import { z, ZodError } from "zod";
import type { Request, Response, NextFunction } from "express";
import status from "http-status";

import { getZodFieldsFromError } from "@/utils/error.js";

export const ValidationSource = {
  BODY: "body",
  QUERY: "query",
  PARAMS: "params",
} as const;

export type ValidationSourceType =
  (typeof ValidationSource)[keyof typeof ValidationSource];

/**
 * Middleware function to validate request data against a Zod schema.
 * @param schema The Zod schema (e.g., ZodObject<...>) to validate against.
 * @param source The location of the data in the request (body, query, or params).
 * @returns An Express middleware function.
 */
export const validate = (
  schema: z.Schema,
  source: ValidationSourceType = ValidationSource.BODY // Default to body
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req[source]);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next({
          status: status.BAD_REQUEST,
          message: `Validation error in ${source}`,
          fields: getZodFieldsFromError(error),
          stack: error.stack,
        });
        return;
      }
      next(error);
    }
  };
};
