import { logger } from "./logger.middleware.js";
import { error as responseError } from "../utils/response.js";

export const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  const code = err.code || null;

  // Log the error with stack
  if (logger && logger.error) {
    logger.error(err.stack || message);
  } else {
    console.error(err.stack || message);
  }

  // Structured error response
  return responseError(res, status, message, code ? { code } : {});
};

export default errorHandler;
