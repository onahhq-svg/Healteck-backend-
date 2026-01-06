import helmet from "helmet";
import cors from "cors";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";

export const securityMiddleware = (app) => {
  // Set security headers
  app.use(helmet());

  // CORS
  const corsOptions = {
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  };
  app.use(cors(corsOptions));

  // Prevent NoSQL injection via req body/query
  app.use(mongoSanitize());

  // Prevent XSS
  app.use(xss());
};

export default securityMiddleware;
