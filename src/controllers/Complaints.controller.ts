import { Request, Response } from "express";
import Complaint from "../models/complaints.model.js";
import User from "../models/user.model.js";

export const createComplaint = async (req: Request, res: Response) => {
  try {
    const { description } = req.body;
    const studentId = req.user?._id;

    // Validate description
    if (!description || description.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Description is required",
      });
    }

    // Validate student ID
    if (!studentId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Get student details and validate role
    const student = await User.findById(studentId)
      .select("firstName roomNumber role")
      .lean();

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    if (student.role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Only students can create complaints",
      });
    }

    // Create the complaint
    const newComplaint = await Complaint.create({
      student: studentId,
      description: description.trim(),
      studentDetails: {
        firstName: student.firstName,
        roomNumber: student.roomNumber,
      },
    });

    // Return formatted response
    return res.status(201).json({
      success: true,
      complaint: {
        _id: newComplaint._id,
        description: newComplaint.description,
        status: newComplaint.status,
        studentDetails: {
          firstName: student.firstName,
          roomNumber: student.roomNumber,
        },
        createdAt: newComplaint.createdAt,
        updatedAt: newComplaint.updatedAt,
      },
    });
  } catch (error) {
    console.error("Create complaint error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create complaint",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get all complaints (Student)

// Get all complaints (Staff/Admin)
export const getComplaints = async (req: Request, res: Response) => {
  try {
    // Populate the student field with firstName and roomNumber
    const complaints = await Complaint.find()
      .populate("student", "firstName roomNumber")
      .lean()
      .exec();

    const transformedComplaints = complaints.map((complaint) => ({
      _id: complaint._id,
      description: complaint.description,
      status: complaint.status,
      studentDetails: {
        firstName: complaint.student
          ? (complaint.student as any).firstName
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

// Update complaint (Student)
export const updateComplaint = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, description } = req.body;
  const studentId = req.user?._id;

  try {
    // Find complaint and verify ownership
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

    // Update fields if provided
    if (status) {
      complaint.status = status;
    }

    if (description) {
      if (description.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: "Description cannot be empty",
        });
      }
      complaint.description = description.trim();
    }

    await complaint.save();

    res.status(200).json({
      success: true,
      complaint: {
        _id: complaint._id,
        description: complaint.description,
        status: complaint.status,
        studentDetails: complaint.studentDetails,
        createdAt: complaint.createdAt,
        updatedAt: complaint.updatedAt,
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ success: false, error: error.message });
    } else {
      res.status(500).json({ success: false, error: "Unknown error" });
    }
  }
};

// Delete a complaint (Admin only)
export const deleteComplaint = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const complaint = await Complaint.findByIdAndDelete(id);
    if (!complaint) {
      return res
        .status(404)
        .json({ success: false, message: "Complaint not found" });
    }

    res.status(200).json({
      success: true,
      message: "Complaint deleted successfully",
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ success: false, error: error.message });
    } else {
      res.status(500).json({ success: false, error: "Unknown error" });
    }
  }
};

// Get student's own complaints
export const getStudentComplaints = async (req: Request, res: Response) => {
  try {
    const studentId = req.user?._id;

    if (!studentId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const complaints = await Complaint.find({ student: studentId })
      .sort({ createdAt: -1 }) // Sort by newest first
      .lean()
      .exec();

    const transformedComplaints = complaints.map((complaint) => ({
      _id: complaint._id,
      description: complaint.description,
      status: complaint.status,
      studentDetails: complaint.studentDetails,
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

// Delete complaint (Student)
export const deleteStudentComplaint = async (req: Request, res: Response) => {
  const { id } = req.params;
  const studentId = req.user?._id;

  try {
    // Check if student is authenticated
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
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ success: false, error: error.message });
    } else {
      return res.status(500).json({ success: false, error: "Unknown error" });
    }
  }
};

// Get all complaints (Staff/Admin)
export const getParentsComplaints = async (req: Request, res: Response) => {
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

    // Populate the student field with firstName and roomNumber
    const complaints = await Complaint.find({ student: child._id })
      .populate("student", "firstName roomNumber")
      .lean()
      .exec();

    const transformedComplaints = complaints.map((complaint) => ({
      _id: complaint._id,
      description: complaint.description,
      status: complaint.status,
      studentDetails: {
        firstName: complaint.student
          ? (complaint.student as any).firstName
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
