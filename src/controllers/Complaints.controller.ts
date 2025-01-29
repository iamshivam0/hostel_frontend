import { Request, Response } from "express";
import Complaint from "../models/complaints.model.js";
import User from "../models/user.model.js";

// Create Complaint
// const errorMessage = error.message || 'An unknown error occurred';
export const createComplaint = async (req: Request, res: Response) => {
  try {
    const { description, type } = req.body;
    const studentId = req.user?._id;

    if (!description || description.trim().length === 0) {
      return res.status(400).json({ success: false, message: "Description is required" });
    }

    if (!type || !["Maintenance", "Disciplinary", "Other"].includes(type)) {
      return res.status(400).json({ success: false, message: "Invalid complaint type" });
    }

    if (!studentId) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }

    const student = await User.findById(studentId).select("firstName roomNumber role").lean();
    if (!student || student.role !== "student") {
      return res.status(403).json({ success: false, message: "Only students can create complaints" });
    }

    const newComplaint = await Complaint.create({
      student: studentId,
      description: description.trim(),
      type,
      studentDetails: { firstName: student.firstName, roomNumber: student.roomNumber },
    });

    return res.status(201).json({
      success: true,
      complaint: {
        _id: newComplaint._id,
        description: newComplaint.description,
        type: newComplaint.type,
        status: newComplaint.status,
        studentDetails: newComplaint.studentDetails,
        createdAt: newComplaint.createdAt,
        updatedAt: newComplaint.updatedAt,
      },
    });
  }catch (error) {
    console.error("Create complaint error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create complaint",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get All Complaints (Admin/Staff)
export const getComplaints = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const complaints = await Complaint.find()
      .populate("student", "firstName roomNumber")
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();

    res.status(200).json({ success: true, complaints });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ success: false, error: error.message });
    } else {
      res.status(500).json({ success: false, error: "Unknown error" });
    }
  }
};

// Update Complaint (Student)
export const updateComplaint = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { description, status, type } = req.body;
  const studentId = req.user?._id;

  try {
    const complaint = await Complaint.findOne({ _id: id, student: studentId });
    if (!complaint) {
      return res.status(404).json({ success: false, message: "Complaint not found or unauthorized" });
    }

    if (description) {
      if (description.trim().length === 0) {
        return res.status(400).json({ success: false, message: "Description cannot be empty" });
      }
      complaint.description = description.trim();
    }

    if (status) {
      complaint.status = status;
    }

    if (type) {
      if (!["Maintenance", "Disciplinary", "Other"].includes(type)) {
        return res.status(400).json({ success: false, message: "Invalid complaint type" });
      }
      complaint.type = type;
    }

    await complaint.save();

    res.status(200).json({ success: true, complaint });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ success: false, error: error.message });
    } else {
      res.status(500).json({ success: false, error: "Unknown error" });
    }
  }
};

// Delete Complaint (Admin Only)
export const deleteComplaint = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const complaint = await Complaint.findByIdAndDelete(id);
    if (!complaint) {
      return res.status(404).json({ success: false, message: "Complaint not found" });
    }

    res.status(200).json({ success: true, message: "Complaint deleted successfully" });
  }catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ success: false, error: error.message });
    } else {
      res.status(500).json({ success: false, error: "Unknown error" });
    }
  }
};

// Get Student's Own Complaints
export const getStudentComplaints = async (req: Request, res: Response) => {
  try {
    const studentId = req.user?._id;
    if (!studentId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const complaints = await Complaint.find({ student: studentId }).sort({ createdAt: -1 }).lean();
    res.status(200).json({ success: true, complaints });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ success: false, error: error.message });
    } else {
      res.status(500).json({ success: false, error: "Unknown error" });
    }
  }
};
export const deleteStudentComplaint = async (req: Request, res: Response) => {
  const { id } = req.params;
  const studentId = req.user?._id;

  try {
    // Check if the student is authenticated
    if (!studentId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Find the complaint and ensure it belongs to the student
    const complaint = await Complaint.findOne({
      _id: id,
      student: studentId,
    });

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found or unauthorized",
      });
    }

    // Delete the complaint
    await Complaint.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Complaint deleted successfully",
      deletedComplaint: {
        _id: complaint._id,
        type: complaint.type, // Include the complaint type in the response
        description: complaint.description,
        status: complaint.status,
        createdAt: complaint.createdAt,
        updatedAt: complaint.updatedAt,
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ success: false, error: error.message });
    } else {
      return res.status(500).json({ success: false, error: "Unknown error" });
    }
  }
};

export const getParentsComplaints = async (req: Request, res: Response) => {
  try {
    const parentId = req.user?._id;

    // Find parent and their children
    const parent = await User.findOne({
      _id: parentId,
      role: "parent",
    });

    if (!parent) {
      return res.status(404).json({ success: false, message: "Parent not found" });
    }

    // Find all children using parent's children array
    const children = await User.find({
      _id: { $in: parent.children },
      role: "student",
    });

    if (!children.length) {
      return res.status(404).json({ success: false, message: "No children found" });
    }

    // Get complaints for all children
    const complaints = await Complaint.find({
      student: { $in: children.map((child) => child._id) },
    })
      .populate("student", "firstName lastName roomNumber")
      .lean()
      .exec();

    const transformedComplaints = complaints.map((complaint) => ({
      _id: complaint._id,
      type: complaint.type, // Include the type in the response
      description: complaint.description,
      status: complaint.status,
      studentDetails: {
        firstName: complaint.student
          ? `${(complaint.student as any).firstName} ${(complaint.student as any).lastName}`
          : "N/A",
        roomNumber: complaint.student
          ? (complaint.student as any).roomNumber
          : "N/A",
      },
      createdAt: complaint.createdAt,
      updatedAt: complaint.updatedAt,
    }));

    res.status(200).json({
      success: true,
      complaints: transformedComplaints,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ success: false, error: error.message });
    } else {
      res.status(500).json({ success: false, error: "Unknown error" });
    }
  }
};
