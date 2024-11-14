import express from "express";
import {
  authenticateToken,
  authorizeRoles,
} from "../middleware/auth.middleware.js";

const router = express.Router();

// Get current user profile
router.get("/profile", authenticateToken, (req, res) => {
  // TODO: Implement get profile logic
  res.json({ message: "Profile route" });
});

// Update user profile
router.put("/profile", authenticateToken, (req, res) => {
  // TODO: Implement update profile logic
  res.json({ message: "Update profile route" });
});

// Admin only routes
router.get("/all", authenticateToken, authorizeRoles(["admin"]), (req, res) => {
  // TODO: Implement get all users logic
  res.json({ message: "Get all users route" });
});

export default router;
