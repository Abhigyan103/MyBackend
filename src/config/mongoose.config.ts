import mongoose from "mongoose";
import { env, logger } from "@/config/index.js";

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(env.DATABASE_URL);
    logger.info("MongoDB connected successfully.");
  } catch (error) {
    logger.error(`MongoDB connection error: ${error}`);
    process.exit(1);
  }
};

// Get the default connection
const db = mongoose.connection;

// Bind connection to error event (to get notification of connection errors)
db.on("connecting", () => {
  logger.info("Mongoose connecting...");
});

db.on("error", (error) => {
  logger.error(`Mongoose default connection error: ${error}`);
});

// If the Node process ends, close the Mongoose connection
process.on("SIGINT", async () => {
  await db.close();
  logger.warn(
    "Mongoose default connection disconnected through app termination."
  );
  process.exit(0);
});
