import winston from 'winston';
import { env } from './server.config.js'; // Assuming you have an env.config.ts file

// Define log levels based on the environment
const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6,
};

// Define colors for each log level for console readability
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  verbose: 'cyan',
  debug: 'white',
  silly: 'gray',
};

// Add the colors to Winston
winston.addColors(colors);

// Set up the log format
const logFormat = winston.format.combine(
  // Add a timestamp
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  // Add a custom format that includes level, timestamp, and message
  winston.format.printf(
    (info) => `${info.timestamp} [${info.level}]: ${info.message}`
  )
);

/**
 * Define the transports for the logger.
 * A transport is where the log is sent (e.g., console, file, a remote service).
 */
const transports = [
  // Console Transport: logs to the console
  new winston.transports.Console({
    // Use a colorized format for the console
    format: winston.format.combine(
      winston.format.colorize({ all: true }),
      logFormat
    ),
  }),

  // File Transport: logs to a file in production
  new winston.transports.File({
    filename: 'logs/combined.log',
    maxsize: 5 * 1024 * 1024, // 5MB
    maxFiles: 5,
    level: 'info', // Only log 'info' and higher to the file
  }),

  // Error File Transport: logs errors to a separate file
  new winston.transports.File({
    filename: 'logs/error.log',
    level: 'error', // Only log 'error' to this file
  }),
];

/**
 * Configure the Winston logger instance.
 * The configuration is dynamic based on the `NODE_ENV` environment variable.
 */
const logger = winston.createLogger({
  level: env.NODE_ENV === 'development' ? 'debug' : 'info', // Set the log level based on the environment
  levels: logLevels,
  format: winston.format.json(), // Use JSON format for structured logging in production
  transports: transports,
});

// If not in production, log to the console with the custom format
if (env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
}

// Export the pre-configured logger instance for use throughout the application
export { logger };