import express from "express";
import {
  authenticateToken,
  authorizeRoles,
} from "../middleware/auth.middleware.js";
import {
  // Parent-Student Management
  assignParentToStudent,
  removeParentFromStudent,
  getStudentParentInfo,
  getAllStudents,
  getAllParents,
  createParent,
  updateParent,
  deleteParent,
  createAdmin,
  getstaff,
  createStaff,
} from "../controllers/admin.controller.js";
import {
  deleteComplaint,
  getComplaints,
} from "../controllers/Complaints.controller.js";

const router = express.Router();

// Protect all admin routes
router.use(authenticateToken, authorizeRoles(["admin"]));

// Admin Management
router.post("/create", createAdmin);

// Parent-Student Management Routes
router.get("/students", getAllStudents);
router.get("/parents", getAllParents);
router.get("/student-parent/:studentId", getStudentParentInfo);
router.get("/complaints", getComplaints);

// Parent Management
router.post("/parent", createParent);
router.put("/parent/:id", updateParent);
router.delete("/parent/:id", deleteParent);

// Parent-Student Assignment
router.post("/assign-parent", assignParentToStudent);
router.delete("/remove-parent/:studentId", removeParentFromStudent);

router.delete("/deletecomplaint/:id", deleteComplaint);

// staff management
router.get("/getallstaffs", getstaff);
router.post("/staff-create", createStaff);

export default router;
