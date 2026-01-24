import jwt from "jsonwebtoken";
import crypto from "crypto";
import { jwt as jwtConfig } from "../config/env.js";

export const signAccess = (payload) =>
  jwt.sign(payload, jwtConfig.accessSecret, { expiresIn: jwtConfig.accessTTL });

export const signRefresh = (payload) =>
  jwt.sign(payload, jwtConfig.refreshSecret, {
    expiresIn: jwtConfig.refreshTTL,
  });

// Generic token signer (used for password reset tokens). Uses refreshSecret by default.
export const signToken = (payload, options = {}) =>
  jwt.sign(payload, jwtConfig.refreshSecret, options);

export const verifyAccess = (token) =>
  jwt.verify(token, jwtConfig.accessSecret);
export const verifyRefresh = (token) =>
  jwt.verify(token, jwtConfig.refreshSecret);

export const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

export default {
  signAccess,
  signRefresh,
  signToken,
  verifyAccess,
  verifyRefresh,
  hashToken,
};
// JWT helpers
