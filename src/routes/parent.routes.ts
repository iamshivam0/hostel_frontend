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
} from "../controllers/parent.controller.js";
import { getParentsComplaints } from "../controllers/Complaints.controller.js";

const router = express.Router();

// Child related routes
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

router.get(
  "/child-leaves",
  authenticateToken,
  authorizeRoles(["parent"]),
  getChildLeaves
);

// Parent profile routes
router.get(
  "/parent_profile",
  authenticateToken,
  authorizeRoles(["parent"]),
  getParentProfile
);
router.patch(
  "/update-profile",
  authenticateToken,
  authorizeRoles(["parent"]),
  updateParentProfile
);

router.get(
  "/getcomplaints",
  authenticateToken,
  authorizeRoles(["parent"]),
  getParentsComplaints
);

// Dashboard route
router.get(
  "/dashboard",
  authenticateToken,
  authorizeRoles(["parent"]),
  getDashboardInfo
);

export default router;
