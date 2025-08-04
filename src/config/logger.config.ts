import winston from 'winston';
import { env } from './server.config.js';

const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6,
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  verbose: 'cyan',
  debug: 'white',
  silly: 'gray',
};

winston.addColors(colors);

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(
    (info) => `${info.timestamp} [${info.level}]: ${info.message}`
  )
);

/**
 * Define the transports for the logger.
 * A transport is where the log is sent (e.g., console, file, a remote service).
 */
const transports = [
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize({ all: true }),
      winston.format.simple(),
      logFormat
    ),
  }),

  new winston.transports.File({
    filename: 'logs/combined.log',
    maxsize: 5 * 1024 * 1024, // 5MB
    maxFiles: 5,
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
  }),

  new winston.transports.File({
    filename: 'logs/error.log',
    level: 'error',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
  }),
];

/**
 * Configure the Winston logger instance.
 * The configuration is dynamic based on the `NODE_ENV` environment variable.
 */
const logger = winston.createLogger({
  level: env.NODE_ENV === 'development' ? 'debug' : 'info',
  levels: logLevels,
  format: winston.format.json(),
  transports: transports,
});

export { logger };