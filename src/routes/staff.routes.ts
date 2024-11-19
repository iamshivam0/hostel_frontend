import express from "express";
import {
  authenticateToken,
  authorizeRoles,
} from "../middleware/auth.middleware.js";
import {
  getStaffProfile,
  getStaffLeaveStats,
  getAllLeaves,
  getPendingLeaves,
  reviewLeave,
  getStaffDashboard,
  changestaffPassword,
} from "../controllers/staff.controller.js";
import { getComplaints } from "../controllers/Complaints.controller.js";

const router = express.Router();

// Staff profile routes
router.get(
  "/profile",
  authenticateToken,
  authorizeRoles(["staff"]),
  getStaffProfile
);

//password

router.put(
  "/change-password",
  authenticateToken,
  authorizeRoles(["staff"]),
  changestaffPassword
);

// Leave management routes
router.get(
  "/leaves",
  authenticateToken,
  authorizeRoles(["staff"]),
  getAllLeaves
);
router.get(
  "/leaves/pending",
  authenticateToken,
  authorizeRoles(["staff"]),
  getPendingLeaves
);
router.post(
  "/leaves/:leaveId/review",
  authenticateToken,
  authorizeRoles(["staff"]),
  reviewLeave
);
router.get(
  "/leave-stats",
  authenticateToken,
  authorizeRoles(["staff"]),
  getStaffLeaveStats
);

// Dashboard route
router.get(
  "/dashboard",
  authenticateToken,
  authorizeRoles(["staff"]),
  getStaffDashboard
);
router.get(
  "/complaints",
  authenticateToken,
  authorizeRoles(["staff"]),
  getComplaints
);

export default router;
