import express from "express";
import { health } from "./home.controller.js";

const router = express.Router();

router.get("/health", health);
router.get("/version", (req, res) => {
  res.json({
    version: process.env.npm_package_version || "1.0.0",
    name: process.env.npm_package_name || "healtek",
  });
});

export default router;
