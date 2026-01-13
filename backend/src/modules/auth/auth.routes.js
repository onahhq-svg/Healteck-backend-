import express from "express";
import * as controller from "./auth.controller.js";
import asyncHandler from "../../utils/asyncHandler.js";
// import { forgotPassword,resetPassword } from "./auth.controller.js";

const router = express.Router();

router.post("/register", asyncHandler(controller.register));
router.post("/login", asyncHandler(controller.login));
router.post("/refresh", asyncHandler(controller.refresh));
router.post("/logout", asyncHandler(controller.logout));
router.post("/forgot-password", asyncHandler(controller.forgotPassword));
router.post("/reset-password", asyncHandler(controller.resetPassword));

export default router;
