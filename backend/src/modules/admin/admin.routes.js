import express from "express";
import authMiddleware from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/role.middleware.js";
import * as controller from "./admin.controller.js";
import asyncHandler from "../../utils/asyncHandler.js";

const router = express.Router();

// All admin routes require authentication + ADMIN role
router.use(authMiddleware);
router.use(requireRole("ADMIN"));

// POST /admin/users — create a new user (admin-only)
router.post("/users", asyncHandler(controller.createUser));

// GET /admin/users — list all users (admin-only)
router.get("/users", asyncHandler(controller.listUsers));

// PUT /admin/users/:userId/role — update user role (admin-only)
router.put("/users/:userId/role", asyncHandler(controller.updateRole));

export default router;
