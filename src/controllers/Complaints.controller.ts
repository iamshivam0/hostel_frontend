import { Request, Response } from "express";
import Complaint from "../models/complaints.model.js";
import User from "../models/user.model.js";

export const createComplaint = async (req: Request, res: Response) => {
  const { description } = req.body;
  const studentId = req.user?._id;

  try {
    const student = await User.findById(studentId).select(
      "firstName roomNumber role"
    );
    if (!student || student.role !== "student") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const complaint = await Complaint.create({
      student: student._id,
      description,
      studentDetails: {
        firstName: student.firstName,
        roomNumber: student.roomNumber,
      },
    });

    res.status(201).json({
      success: true,
      complaint: {
        _id: complaint._id,
        description: complaint.description,
        status: complaint.status,
        studentDetails: {
          firstName: student.firstName,
          roomNumber: student.roomNumber,
        },
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

// Update complaint status (Student)
export const updateComplaint = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const studentId = req.user?._id;

  try {
    const complaint = await Complaint.findById(id);
    if (!complaint) {
      return res
        .status(404)
        .json({ success: false, message: "Complaint not found" });
    }

    complaint.status = status;
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
