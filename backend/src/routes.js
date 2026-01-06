import express from "express";
import authRoutes from "./modules/auth/auth.routes.js";
import authMiddleware from "./middlewares/auth.middleware.js";
import * as userController from "./modules/user/user.controller.js";
import asyncHandler from "./utils/asyncHandler.js";

const apiRouter = express.Router();

// User routes (protected)
apiRouter.get("/me", authMiddleware, asyncHandler(userController.getMe));
apiRouter.put("/me", authMiddleware, asyncHandler(userController.updateMe));

export default {
    auth: authRoutes,
    api: apiRouter,
};
//# Central route loader
