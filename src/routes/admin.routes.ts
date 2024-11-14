import express from "express";
import { createAdmin } from "../controllers/admin.controller.js";
import {
  authenticateToken,
  authorizeRoles,
} from "../middleware/auth.middleware.js";

const router = express.Router();

// Only existing admins can create new admins
router.post(
  "/create",
  authenticateToken,
  authorizeRoles(["admin"]),
  createAdmin
);

export default router;
