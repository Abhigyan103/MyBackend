import type { Request, Response, NextFunction } from "express";
import { logger } from "../config/index.js";

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const timestamp = new Date().toISOString();
  const jwtPresent = !!(req.cookies && req.cookies.jwt);
  logger.info(
    `${timestamp} - ${req.method} ${
      req.url
    } JWT:${jwtPresent}, Body: ${JSON.stringify(
      req.body
    )}, Query: ${JSON.stringify(req.query)}, Params: ${JSON.stringify(
      req.params
    )}`
  );
  next();
};
