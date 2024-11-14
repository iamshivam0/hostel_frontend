import express from "express";
import {
  submitLeave,
  getStudentLeaves,
  getAllLeaves,
  reviewLeave,
  getPendingLeaves,
} from "../controllers/leave.controller.js";
import {
  authenticateToken,
  authorizeRoles,
} from "../middleware/auth.middleware.js";

const router = express.Router();

// Student routes
router.post(
  "/apply",
  authenticateToken,
  authorizeRoles(["student"]),
  submitLeave
);
router.get(
  "/my-leaves",
  authenticateToken,
  authorizeRoles(["student"]),
  getStudentLeaves
);

// Staff routes
router.get(
  "/all",
  authenticateToken,
  authorizeRoles(["staff", "admin"]),
  getAllLeaves
);
router.get(
  "/pending",
  authenticateToken,
  authorizeRoles(["staff", "admin"]),
  getPendingLeaves
);
router.post(
  "/:leaveId/review",
  authenticateToken,
  authorizeRoles(["staff", "admin"]),
  reviewLeave
);

export default router;
