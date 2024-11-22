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
import { validateLeaveReview } from "../middleware/leave.middleware.js";
import { configureMulter } from "../middleware/upload.middleware.js";
import { getMessPhoto, uploadMessPhoto } from "../controllers/mess.controller.js";
import { requestPasswordReset, resetPassword } from "../controllers/student.controller.js";
const router = express.Router();

const messUpload = configureMulter("mess_photos");

// Add interface for authenticated request
interface AuthenticatedRequest extends express.Request {
  user?: {
    _id: string;
    role: string;
  };
}

// Staff profile routes
router.get(
  "/profile",
  authenticateToken as any,
  authorizeRoles(["staff"]),
  getStaffProfile
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
  validateLeaveReview,
  reviewLeave
);

// Other routes remain the same...
router.get(
  "/leave-stats",
  authenticateToken as any,
  authorizeRoles(["staff"]),
  getStaffLeaveStats
);

router.get(
  "/dashboard",
  authenticateToken as any,
  authorizeRoles(["staff"]),
  getStaffDashboard
);

router.put(
  "/change-password",
  authenticateToken as any,
  authorizeRoles(["staff"]),
  changestaffPassword
);

router.get(
  "/complaints",
  authenticateToken as any,
  authorizeRoles(["staff"]),
  getComplaints
);

// mess-controls

router.post("/upload-mess-menu", authenticateToken as any,
  authorizeRoles(["staff"]),
  messUpload.single("messPhoto"),
  uploadMessPhoto);
router.get("/mess-menu",authenticateToken as any,
  authorizeRoles(["staff"]),
  getMessPhoto);

export default router;
