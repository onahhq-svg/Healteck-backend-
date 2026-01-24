import express from "express";
import routes from "./routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import { requestLogger } from "./middlewares/logger.middleware.js";
import { authLimiter, apiLimiter } from "./middlewares/ratelimit.middleware.js";
import securityMiddleware from "./middlewares/security.middleware.js";
import homeRoutes from "./modules/home/home.routes.js";
import adminRoutes from "./modules/admin/admin.routes.js";
import setupSwagger from "./config/swagger.js";
import authMiddleware from "./middlewares/auth.middleware.js";
import { attachProfile } from "./middlewares/profile.middleware.js";
import cors from "cors";

export default function createApp() {
  const app = express();
  app.use(requestLogger);
  // Security middlewares (helmet, cors, sanitizers)
  securityMiddleware(app);
  app.use(express.json());
  app.use(cors({origin:"http://localhost:5173",credentials:true}));

  // Swagger UI (enabled in non-production or when SWAGGER_ENABLE=true)
  setupSwagger(app);
//public routes
  app.use("/auth", authLimiter, routes.auth);
  app.use("/", homeRoutes);
 
  //protected routes
  app.use(authMiddleware);
  app.use(attachProfile);

  //API routes
  
  app.use("/admin", apiLimiter, adminRoutes);
  app.use("/", apiLimiter, routes.api);
  app.use(errorHandler);

  return app;
}
