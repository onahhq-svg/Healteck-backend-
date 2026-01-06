import winston from "winston";
import morgan from "morgan";

const { combine, timestamp, printf, colorize, errors } = winston.format;

const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} ${level}: ${stack || message}`;
});

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: combine(
    errors({ stack: true }),
    timestamp(),
    colorize({ all: true }),
    logFormat
  ),
  transports: [new winston.transports.Console()],
});

// Morgan middleware that uses winston
export const requestLogger = morgan("combined", {
  stream: {
    write: (message) => logger.info(message.trim()),
  },
});

export default { logger, requestLogger };
