import winston from "winston";
import { env, NodeEnv } from "./server.config.js";

interface CustomLevels extends winston.Logger {
  db: winston.LeveledLogMethod;
  ongoing: winston.LeveledLogMethod;
}

const logLevels = {
  error: 0,
  warn: 1,
  http: 2,
  ongoing: 3,
  info: 4,
  verbose: 5,
  db: 6,
  debug: 7,
  silly: 8,
};

const colors = {
  error: "red",
  warn: "yellow",
  http: "magenta",
  ongoing: "italic gray",
  info: "green",
  verbose: "cyan",
  db: "blue",
  debug: "white",
  silly: "black",
};

winston.addColors(colors);

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),

  winston.format.printf((info) => {
    const { level, message, timestamp, ...dataDump } = info;

    const data = JSON.stringify({
      timestamp: timestamp,
      ...dataDump,
    });
    let log = `[${info.level}]: ${info.message} `;
    const colorizer = winston.format.colorize();
    log += colorizer.colorize("silly", data);
    return log;
  })
);

/**
 * Define the transports for the logger.
 * A transport is where the log is sent (e.g., console, file, a remote service).
 */
const transports = [
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize({ all: true }),
      logFormat
    ),
  }),

  new winston.transports.File({
    filename: "logs/combined.log",
    maxsize: 5 * 1024 * 1024, // 5MB
    maxFiles: 5,
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
  }),

  new winston.transports.File({
    filename: "logs/error.log",
    level: "error",
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
  }),
];

const getLevel = (NODE_ENV: NodeEnv) => {
  switch (NODE_ENV) {
    case NodeEnv.local:
      return "silly";
    case NodeEnv.development:
      return "debug";
    case NodeEnv.test:
      return "db";
    case NodeEnv.production:
      return "info";
  }
};

/**
 * Configure the Winston logger instance.
 * The configuration is dynamic based on the `NODE_ENV` environment variable.
 */
const logger = winston.createLogger({
  level: getLevel(env.NODE_ENV),
  levels: logLevels,
  format: winston.format.json(),
  transports: transports,
}) as CustomLevels;

export { logger };
