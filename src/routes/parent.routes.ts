import express from "express";
import {
  authenticateToken,
  authorizeRoles,
} from "../middleware/auth.middleware.js";
// import { authenticateToken } from ;

const router = express.Router();

// Route to show a "HI" message when a parent logs in
router.get(
  "/parent_profile",
  authenticateToken,
  authorizeRoles(["parent"]),
  (req, res) => {
    res.status(200).json({ message: "HI" });
  }
);

// Parent routes
router.get(
  "/dashboard",
  authenticateToken,
  authorizeRoles(["parent"]),
  (req, res) => {
    res.json({ message: "Parent dashboard" });
  }
);

// Add more parent-specific routes here

export default router;
