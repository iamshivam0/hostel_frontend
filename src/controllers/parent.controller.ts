import { Request, Response } from "express";
import User, { IUser } from "../models/user.model.js";
import Leave from "../models/leave.model.js";

// Add type for the authenticated request
interface AuthRequest extends Request {
  user?: {
    _id: string;
    role: string;
  };
}

export const getChildStats = async (req: AuthRequest, res: Response) => {
  try {
    const parentId = req.user?._id;

    // Find parent and their child
    const parent = await User.findOne({
      _id: parentId,
      role: "parent",
    });

    if (!parent) {
      return res.status(404).json({ message: "Parent not found" });
    }

    // Find child using parent's children array
    const child = await User.findOne({
      _id: { $in: parent.children },
      role: "student",
    });

    if (!child) {
      return res.status(404).json({ message: "Child not found" });
    }

    // Get leave statistics
    const leaves = await Leave.find({ studentId: child._id });

    const stats = {
      totalLeaves: leaves.length,
      pendingLeaves: leaves.filter((leave) => leave.status === "pending")
        .length,
      approvedLeaves: leaves.filter((leave) => leave.status === "approved")
        .length,
      childName: `${child.firstName} ${child.lastName}`,
      roomNumber: child.roomNumber,
    };

    res.status(200).json(stats);
  } catch (error) {
    console.error("Error in getChildStats:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getChildInfo = async (req: AuthRequest, res: Response) => {
  try {
    const parentId = req.user?._id;

    const parent = await User.findOne({
      _id: parentId,
      role: "parent",
    });

    if (!parent) {
      return res.status(404).json({ message: "Parent not found" });
    }

    const child = await User.findOne({
      _id: { $in: parent.children },
      role: "student",
    }).select("-password");

    if (!child) {
      return res.status(404).json({ message: "Child not found" });
    }

    res.status(200).json(child);
  } catch (error) {
    console.error("Error in getChildInfo:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getChildLeaves = async (req: AuthRequest, res: Response) => {
  try {
    const parentId = req.user?._id;

    const parent = await User.findOne({
      _id: parentId,
      role: "parent",
    });

    if (!parent) {
      return res.status(404).json({ message: "Parent not found" });
    }

    const child = await User.findOne({
      _id: { $in: parent.children },
      role: "student",
    });

    if (!child) {
      return res.status(404).json({ message: "Child not found" });
    }

    const leaves = await Leave.find({ studentId: child._id }).sort({
      createdAt: -1,
    });

    res.status(200).json(leaves);
  } catch (error) {
    console.error("Error in getChildLeaves:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getParentProfile = async (req: AuthRequest, res: Response) => {
  try {
    const parentId = req.user?._id;

    const parent = await User.findOne({
      _id: parentId,
      role: "parent",
    })
      .select("-password")
      .populate({
        path: "children",
        select: "-password",
        match: { role: "student" },
      });

    if (!parent) {
      return res.status(404).json({ message: "Parent not found" });
    }

    res.status(200).json(parent);
  } catch (error) {
    console.error("Error in getParentProfile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getDashboardInfo = async (req: AuthRequest, res: Response) => {
  try {
    const parentId = req.user?._id;

    const parent = await User.findOne({
      _id: parentId,
      role: "parent",
    });

    if (!parent) {
      return res.status(404).json({ message: "Parent not found" });
    }

    const child = await User.findOne({
      _id: { $in: parent.children },
      role: "student",
    });

    if (!child) {
      return res.status(404).json({ message: "Child not found" });
    }

    // Get all required dashboard information
    const [recentLeaves] = await Promise.all([
      Leave.find({ studentId: child._id }).sort({ createdAt: -1 }).limit(5),
    ]);

    const dashboardInfo = {
      parent: await User.findById(parentId).select("-password"),
      child: child.toObject(),
      recentLeaves,
    };

    res.status(200).json(dashboardInfo);
  } catch (error) {
    console.error("Error in getDashboardInfo:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateParentProfile = async (req: AuthRequest, res: Response) => {
  try {
    const parentId = req.user?._id;
    const updates = req.body;

    // Remove sensitive fields from updates
    delete updates.password;
    delete updates.children;
    delete updates.role;

    const updatedParent = await User.findOneAndUpdate(
      { _id: parentId, role: "parent" },
      { $set: updates },
      { new: true }
    ).select("-password");

    if (!updatedParent) {
      return res.status(404).json({ message: "Parent not found" });
    }

    res.status(200).json(updatedParent);
  } catch (error) {
    console.error("Error in updateParentProfile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
