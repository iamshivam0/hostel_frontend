import express from "express";
import {
  authenticateToken,
  authorizeRoles,
} from "../middleware/auth.middleware.js";
import {
  getStudentProfile,
  getStudentLeaveStats,
  getStudentLeaves,
  submitLeave,
  updateStudentProfile,
  getStudentDashboard,
  changeStudentPassword,
  getStudentRoomates,
} from "../controllers/student.controller.js";
import {
  createComplaint,
  updateComplaint,
} from "../controllers/Complaints.controller.js";
import { isStudent} from "../middleware/complaint.middleware.js";

const router = express.Router();

// Student profile routes
router.get(
  "/profile",
  authenticateToken,
  authorizeRoles(["student"]),
  getStudentProfile
);
router.put(
  "/profile",
  authenticateToken,
  authorizeRoles(["student"]),
  updateStudentProfile
);

// Password change route
router.put(
  "/change-password",
  authenticateToken,
  authorizeRoles(["student"]),
  changeStudentPassword
);

// Leave management routes
router.get(
  "/leaves",
  authenticateToken,
  authorizeRoles(["student"]),
  getStudentLeaves
);
router.post(
  "/leaves",
  authenticateToken,
  authorizeRoles(["student"]),
  submitLeave
);
router.get(
  "/leave-stats",
  authenticateToken,
  authorizeRoles(["student"]),
  getStudentLeaveStats
);

// Dashboard route
router.get(
  "/dashboard",
  authenticateToken,
  authorizeRoles(["student"]),
  getStudentDashboard
);

// roomates route
router.get(
  "/roommates",
  authenticateToken,
  authorizeRoles(["student"]),
  getStudentRoomates
);
router.post("/complaint",authenticateToken, authorizeRoles(["student"]), createComplaint);

router.put("/complaint-update:id",authenticateToken, authorizeRoles(["student"]) , updateComplaint);

export default router;
