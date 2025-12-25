import { Router, type Request, type Response } from "express";
import status from "http-status";

import { db, logger, redisClient } from "@/config/index.js";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  let isMongoConnected = false;
  let isRedisConnected = false;
  let statusCode: number = status.FAILED_DEPENDENCY;
  // Check all services
  try {
    isMongoConnected = await db
      .command({ ping: 1 })
      .then(() => true)
      .catch(() => false);

    isRedisConnected = await redisClient
      .ping()
      .then(() => true)
      .catch(() => false);

    if (isMongoConnected && isRedisConnected) {
      statusCode = status.OK;
    }
  } catch (error) {
    logger.error("Health check failed", error);
  }

  res.status(statusCode).send({
    isMongoConnected,
    isRedisConnected,
  });
});

export default router;
