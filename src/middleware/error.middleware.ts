import type { Request, Response, NextFunction } from "express";
import HttpStatus from "http-status";

import type { HttpError } from "@/types/error.types.js";
import { env, logger, NodeEnv } from "@/config/index.js";

/**
 * Global Error Handling Middleware
 * Express recognizes a function with four arguments (err, req, res, next)
 * as an error handler.
 */
const errorHandler = (
  err: HttpError, // Use the custom interface for the error object
  req: Request,
  res: Response,
  next: NextFunction // The 'next' argument is required even if not used
) => {
  try {
    const stack = err.stack;
    const status = err.status || HttpStatus.INTERNAL_SERVER_ERROR;
    const fields = err.fields;
    const errorMessage = err.message || "Something went wrong";

    logger.error("[ErrorResponse]", {
      errorStack: stack,
      errorMessage,
      fields,
      status,
    });

    // Send the error response to the client
    res.status(status).send({
      fields,
      errorMessage,
      stack: env.NODE_ENV === NodeEnv.production ? undefined : stack,
    });
  } catch (error: any) {
    logger.error(`Error in errorHandler middleware: ${error}`);
    next();
  }
};

export default errorHandler;
