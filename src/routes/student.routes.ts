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
  uploadProfilePicture,
} from "../controllers/student.controller.js";
import {
  createComplaint,
  getStudentComplaints,
  updateComplaint,
  deleteStudentComplaint,
} from "../controllers/Complaints.controller.js";
import { configureMulter } from "../middleware/upload.middleware.js"; // Import the multer configuration
import { getMessPhoto } from "../controllers/mess.controller.js";
import {
  getStudentAnnouncements,
  postStudentAnnouncement,
} from "../controllers/Announcment.controller.js";

// Configure multer for profile photos
const profileUpload = configureMulter("profile_photos");

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
  "/leaves/apply",
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

// Roommates route
router.get(
  "/roommates",
  authenticateToken,
  authorizeRoles(["student"]),
  getStudentRoomates
);

// Complaint routes
router.post(
  "/complaint",
  authenticateToken,
  authorizeRoles(["student"]),
  createComplaint
);
router.patch(
  "/complaint-update/:id",
  authenticateToken,
  authorizeRoles(["student"]),
  updateComplaint
);
router.get(
  "/complaint",
  authenticateToken,
  authorizeRoles(["student"]),
  getStudentComplaints
);
router.delete(
  "/complaint/:id",
  authenticateToken,
  authorizeRoles(["student"]),
  deleteStudentComplaint
);

// Profile picture upload route
router.post(
  "/upload-profile-pic",
  authenticateToken,
  authorizeRoles(["student"]),
  profileUpload.single("profilePic"), // Use the configured profileUpload middleware
  uploadProfilePicture
);

//mess-controls

router.get(
  "/mess-menu",
  authenticateToken,
  authorizeRoles(["student"]),
  getMessPhoto
);

//announcment controls
router.get(
  "/getAnnouncments",
  authenticateToken,
  authorizeRoles(["student"]),
  getStudentAnnouncements
);
router.post(
  "/create-announcement",
  authenticateToken,
  authorizeRoles(["student"]),
  postStudentAnnouncement
);
export default router;
