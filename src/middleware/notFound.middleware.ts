import type { Request, Response, NextFunction } from "express";
import status from "http-status";

import type { HttpError } from "@/types/error.types.js";

const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  const error: HttpError = new Error(`Not Found - ${req.originalUrl}`);
  error.status = status.NOT_FOUND;
  // Pass the error to the global error handler
  next(error);
};

export default notFoundHandler;
