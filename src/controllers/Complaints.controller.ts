import { Request, Response } from "express";
import Complaint from "../models/complaints.model.js";
import User from "../models/user.model.js";

export const createComplaint = async (req: Request, res: Response) => {
  const { description } = req.body;
  const studentId = req.user?._id; // Assuming req.user contains the logged-in user's ID
  console.log(description);
  try {
    const student = await User.findById(studentId).select('firstName roomNumber role'); // Ensure required fields are selected
    if (!student || student.role !== "student") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    if (!student.roomNumber || !student.firstName) {
      return res.status(400).json({
        success: false,
        message: "Room number and first name are required for complaints.",
      });
    }

    const complaint = await Complaint.create({
      student: student._id, // Use the _id of the student
      description,
      studentDetails: {
        firstName: student.firstName,
        roomNumber: student.roomNumber,
      },
    });

    res.status(201).json({
      success: true,
      complaint: {
        id: complaint._id,
        description: complaint.description,
        status: complaint.status,
        studentDetails: {
          firstName: student.firstName,
          roomNumber: student.roomNumber,
        },
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
      .populate("student", "firstName roomNumber") // Populate the student field
      .exec();

    const transformedComplaints = complaints.map((complaint) => ({
      id: complaint._id,
      description: complaint.description,
      status: complaint.status,
      studentDetails: complaint.student
        ? {
            firstName: complaint.student , // Now this is populated
            roomNumber: complaint.student, // Now this is populated
          }
        : " Student not found",
    }));

    res.status(200).json({ success: true, complaints: transformedComplaints });
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
  const studentId = req.user?._id; // Assuming req.user contains the logged-in student's ID

  try {
    const complaint = await Complaint.findById(id);
    console.log(id);
    if (!complaint) return res.status(404).json({ success: false, message: "Complaint not found" });

    // Only the student who created the complaint can update it
    if (complaint.student.toString() !== studentId) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    complaint.status = status;
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

// Delete a complaint (Admin only)
export const deleteComplaint = async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log(id);

  try {
    const complaint = await Complaint.findOne({_id : id});
    if (!complaint) return res.status(404).json({ success: false, message: "Complaint not found" });

    await Complaint.deleteOne({ _id: id }); // Replace .remove() with .deleteOne()
    res.status(200).json({ success: true, message: "Complaint deleted successfully" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ success: false, error: error.message });
    } else {
      res.status(500).json({ success: false, error: "Unknown error" });
    }
  }
};
