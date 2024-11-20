import express from "express";
import {
  authenticateToken,
  authorizeRoles,
} from "../middleware/auth.middleware.js";
import {
  getChildStats,
  getChildInfo,
  getChildLeaves,
  getParentProfile,
  getDashboardInfo,
  updateParentProfile,
  reviewLeave,
} from "../controllers/parent.controller.js";
import { getParentsComplaints } from "../controllers/Complaints.controller.js";

const router = express.Router();

// Profile routes
router.get(
  "/profile",
  authenticateToken,
  authorizeRoles(["parent"]),
  getParentProfile
);

router.put(
  "/profile",
  authenticateToken,
  authorizeRoles(["parent"]),
  updateParentProfile
);

// Child information routes
router.get(
  "/child-stats",
  authenticateToken,
  authorizeRoles(["parent"]),
  getChildStats
);

router.get(
  "/child-info",
  authenticateToken,
  authorizeRoles(["parent"]),
  getChildInfo
);

// Leave management routes
router.get(
  "/child-leaves",
  authenticateToken,
  authorizeRoles(["parent"]),
  getChildLeaves
);

// Add this new route for reviewing leaves
router.post(
  "/leaves/:leaveId/review",
  authenticateToken,
  authorizeRoles(["parent"]),
  reviewLeave
);

// Dashboard route
router.get(
  "/dashboard",
  authenticateToken,
  authorizeRoles(["parent"]),
  getDashboardInfo
);

// Complaints route
router.get(
  "/complaints",
  authenticateToken,
  authorizeRoles(["parent"]),
  getParentsComplaints
);

export default router;
