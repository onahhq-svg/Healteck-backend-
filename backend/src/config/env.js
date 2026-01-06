import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = process.env.NODE_ENV === "test" ? ".env.test" : ".env";
dotenv.config({ path: path.resolve(process.cwd(), envPath) });

// Minimal required envs with defaults for non-production
process.env.PORT = process.env.PORT || "3000";
process.env.MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/healtek";
process.env.JWT_ACCESS_SECRET =
  process.env.JWT_ACCESS_SECRET || "change_me_access_secret";
process.env.JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || "change_me_refresh_secret";
process.env.ACCESS_TOKEN_TTL = process.env.ACCESS_TOKEN_TTL || "15m";
process.env.REFRESH_TOKEN_TTL = process.env.REFRESH_TOKEN_TTL || "7d";

// Validate critical envs in production
const requiredInProd = ["MONGO_URI", "JWT_ACCESS_SECRET", "JWT_REFRESH_SECRET"];
if (process.env.NODE_ENV === "production") {
  const missing = requiredInProd.filter((k) => !process.env[k]);
  if (missing.length) {
    console.error(
      `Missing required env vars in production: ${missing.join(", ")}`
    );
    throw new Error("Missing required environment variables");
  }
} else {
  // Warn if secrets are using defaults
  if (
    process.env.JWT_ACCESS_SECRET === "change_me_access_secret" ||
    process.env.JWT_REFRESH_SECRET === "change_me_refresh_secret"
  ) {
    console.warn(
      "Using default JWT secrets — change for production environments."
    );
  }
}

const config = {
  env: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT),
  mongoURI: process.env.MONGO_URI,
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    accessTTL: process.env.ACCESS_TOKEN_TTL,
    refreshTTL: process.env.REFRESH_TOKEN_TTL,
  },
};

export default config;
export const jwt = config.jwt;
