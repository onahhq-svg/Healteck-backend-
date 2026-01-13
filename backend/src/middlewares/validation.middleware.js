// src/middlewares/validation.middleware.js
import { validationResult } from 'express-validator';
import { BadRequestError } from '../utils/error.js';

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  
  const extractedErrors = errors.array().map(err => ({
    [err.param]: err.msg,
    location: err.location,
  }));

  throw new BadRequestError('Validation failed', { errors: extractedErrors });
};

// Middleware to validate object IDs
export const validateObjectId = (paramName) => {
  return (req, res, next) => {
    const id = req.params[paramName];
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      throw new BadRequestError(`Invalid ${paramName} ID`);
    }
    next();
  };
};