import { Router, type Request, type Response } from "express";
import status from "http-status";
import mongoose from "mongoose";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  // Check all services
  const isMongoConnected = mongoose.connection.readyState === 1;

  const someOtherService = true;

  let statusCode: number = status.OK;

  if (!(isMongoConnected && someOtherService)) {
    statusCode = status.FAILED_DEPENDENCY;
  }
  res.status(statusCode).send({
    isMongoConnected,
    someOtherService,
  });
});

export default router;
