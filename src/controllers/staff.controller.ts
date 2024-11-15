import { Request, Response } from "express";
import Leave from "../models/leave.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";

// Get staff profile
export const getStaffProfile = async (req: Request, res: Response) => {
  try {
    const staffId = req.user?._id;
    if (!staffId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const staff = await User.findById(staffId).select("-password");
    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    res.json(staff);
  } catch (error) {
    console.error("Error fetching staff profile:", error);
    res.status(500).json({ message: "Failed to fetch staff profile" });
  }
};

// Get leave statistics for staff dashboard
export const getStaffLeaveStats = async (req: Request, res: Response) => {
  try {
    const leaves = await Leave.find({});

    const stats = leaves.reduce(
      (acc, leave) => {
        acc.total++;
        switch (leave.status.toLowerCase()) {
          case "pending":
            acc.pending++;
            break;
          case "approved":
            acc.approved++;
            break;
        }
        return acc;
      },
      { pending: 0, approved: 0, total: 0 }
    );

    res.json(stats);
  } catch (error) {
    console.error("Error fetching leave statistics:", error);
    res.status(500).json({ message: "Failed to fetch leave statistics" });
  }
};

// Get all leaves for staff review
export const getAllLeaves = async (req: Request, res: Response) => {
  try {
    const leaves = await Leave.find({})
      .sort({ createdAt: -1 })
      .populate("studentId", "firstName lastName email")
      .populate("reviewedBy", "firstName lastName");

    res.json(leaves);
  } catch (error) {
    console.error("Error fetching leaves:", error);
    res.status(500).json({ message: "Failed to fetch leaves" });
  }
};

// Get pending leaves for staff review
export const getPendingLeaves = async (req: Request, res: Response) => {
  try {
    const leaves = await Leave.find({ status: "pending" })
      .sort({ createdAt: -1 })
      .populate("studentId", "firstName lastName email")
      .populate("reviewedBy", "firstName lastName");

    res.json(leaves);
  } catch (error) {
    console.error("Error fetching pending leaves:", error);
    res.status(500).json({ message: "Failed to fetch pending leaves" });
  }
};

// Review leave application (approve/reject)
export const reviewLeave = async (req: Request, res: Response) => {
  try {
    const { leaveId } = req.params;
    const { action, remarks } = req.body;
    const staffId = req.user?._id;

    if (!staffId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!["approve", "reject"].includes(action)) {
      return res.status(400).json({ message: "Invalid action" });
    }

    const leave = await Leave.findById(leaveId);
    if (!leave) {
      return res.status(404).json({ message: "Leave not found" });
    }

    if (leave.status !== "pending") {
      return res.status(400).json({ message: "Leave already reviewed" });
    }

    leave.status = action === "approve" ? "approved" : "rejected";
    leave.staffRemarks = remarks;
    leave.reviewedBy = new mongoose.Types.ObjectId(staffId);
    leave.reviewedAt = new Date();

    await leave.save();

    res.json({ message: `Leave ${action}ed successfully`, leave });
  } catch (error) {
    console.error("Error reviewing leave:", error);
    res.status(500).json({ message: "Failed to review leave" });
  }
};

// Get staff dashboard data
export const getStaffDashboard = async (req: Request, res: Response) => {
  try {
    const staffId = req.user?._id;
    if (!staffId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Get staff profile
    const staff = await User.findById(staffId).select("-password");
    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    // Get leave statistics
    const leaves = await Leave.find({});
    const stats = leaves.reduce(
      (acc, leave) => {
        acc.total++;
        switch (leave.status.toLowerCase()) {
          case "pending":
            acc.pending++;
            break;
          case "approved":
            acc.approved++;
            break;
        }
        return acc;
      },
      { pending: 0, approved: 0, total: 0 }
    );

    // Get recent leaves
    const recentLeaves = await Leave.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("studentId", "firstName lastName email")
      .populate("reviewedBy", "firstName lastName");

    res.json({
      staff,
      stats,
      recentLeaves,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ message: "Failed to fetch dashboard data" });
  }
};

export const changestaffPassword = async (req: Request, res: Response) => {
  try {
    const staffId = req.user?._id;
    if (!staffId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { currentPassword, newPassword } = req.body;

    const staff = await User.findById(staffId);
    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    const isMatch = await staff.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    staff.password = newPassword;
    await staff.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error changing staff password:", error);
    res.status(500).json({ message: "Failed to change staff password" });
  }
};
