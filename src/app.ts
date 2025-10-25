import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

import { connectDB, env, logger } from "@/config/index.js";

import v1Router from "./api/v1/routes.js";
import {
  errorHandler,
  notFoundHandler,
  requestLogger,
} from "./middleware/index.js";

logger.info(`Starting server in ${env.NODE_ENV.toUpperCase()} mode...`);

// Initialize Express app
const app = express();
const PORT = env.PORT;

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Custom middlewares
app.use(requestLogger);

app.use("/api/v1", v1Router);

// Error handling middlewares
app.use(notFoundHandler);
app.use(errorHandler);

connectDB();

// Start the Express server
app.listen(PORT, () => {
  logger.info(`Server is running on PORT: ${PORT}`);
});
