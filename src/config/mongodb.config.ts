import { MongoClient } from "mongodb";
import { env, logger } from "@/config/index.js";

export const client = new MongoClient(env.DATABASE_URL, {
  retryWrites: true,
  monitorCommands: true,
});
export const db = client.db(env.DATABASE_NAME);

client.on("serverOpening", () => {
  logger.ongoing("MongoDB is connecting...");
});

client.on("error", (err) => {
  logger.error(`MongoDB connection error: ${err}`);
});

client.on("commandSucceeded", (data) => {
  logger.db("MongoDB command.", {
    commandName: data.commandName,
    duration: data.duration,
    reply: data.reply,
  });
});

export const connectDB = async (): Promise<void> => {
  try {
    await client.connect();
    logger.info("MongoDB connected successfully!");
  } catch (error: any) {
    logger.error(`MongoDB connection error`, { error: error.stack });
    process.exit(1);
  }
};
