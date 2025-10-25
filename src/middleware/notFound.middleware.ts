import type { Request, Response, NextFunction } from "express";

import type { HttpError } from "@/types/error.types.js";

const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  const error: HttpError = new Error(`Not Found - ${req.originalUrl}`);
  error.status = 404;
  // Pass the error to the global error handler
  next(error);
};

export default notFoundHandler;
