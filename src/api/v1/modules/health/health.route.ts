import { Router, type Request, type Response } from "express";
import status from "http-status";
import { redisClient, db } from "@/config/index.js";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  // Check all services
  const isMongoConnected = await db
    .command({ ping: 1 })
    .then(() => true)
    .catch(() => false);

  const isRedisConnected = await redisClient
    .ping()
    .then(() => true)
    .catch(() => false);

  let statusCode: number = status.OK;

  if (!(isMongoConnected && isRedisConnected)) {
    statusCode = status.FAILED_DEPENDENCY;
  }
  res.status(statusCode).send({
    isMongoConnected,
    isRedisConnected,
  });
});

export default router;
