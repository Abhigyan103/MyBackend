import type { Request, Response, NextFunction } from "express";
import { logger } from "@/config/index.js";

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const startTime = process.hrtime();
  const timestamp = new Date().toISOString();

  logger.http(`[REQUEST] ${req.method} ${req.url}`, {
    url: req.originalUrl || req.url,
    method: req.method,
    headers: req.headers,
    query: req.query,
    body: req.body,
    cookies: req.cookies,
    ip: req.ip,
    timestamp,
  });

  res.on("finish", () => {
    const [seconds, nanoseconds] = process.hrtime(startTime);
    const durationMs = seconds * 1000 + nanoseconds / 1000000;

    // Log final status code and response time
    logger.http(`[RESPONSE] ${req.method} ${req.originalUrl} `, {
      statusCode: res.statusCode,
      durationMs: durationMs.toFixed(3),
      type: "response",
      method: req.method,
      url: req.originalUrl || req.url,
    });
  });

  next();
};
