import User from "../models/user.model.js";
import { Request, Response } from "express";

export const getAllRoommates = async (req: Request, res: Response) => {
  try {
    // Ensure the user is an admin
    const isAdmin = req.user?.role === "admin";
    if (!isAdmin) {
      return res.status(403).json({ message: "Forbidden: Admins only" });
    }

    // Find all students and group them by room number
    const students = await User.find({ role: "student" })
      .select("firstName lastName email roomNumber") // Select only necessary fields
      .lean();

    // Group students by room number
    const rooms = students.reduce((acc: Record<string, any[]>, student) => {
      const roomNumber = student.roomNumber || "Unassigned";
      if (!acc[roomNumber]) {
        acc[roomNumber] = [];
      }
      acc[roomNumber].push(student);
      return acc;
    }, {});

    // Convert grouped data into an array for easy consumption
    const roomDetails = Object.entries(rooms).map(([roomNumber, occupants]) => ({
      roomNumber,
      occupants,
    }));

    res.json(roomDetails);
  } catch (error) {
    console.error("Error fetching all roommates:", error);
    res.status(500).json({ message: "Failed to fetch roommates" });
  }
};
import mongoose from "mongoose";

export const AssignOrUpdateRoom = async (req: Request, res: Response) => {
  try {
    // Ensure the user is an admin
    const isAdmin = req.user?.role === "admin";
    if (!isAdmin) {
      return res.status(403).json({ message: "Forbidden: Admins only" });
    }

    // Extract studentId and roomNumber from the request body
    const { studentId, roomNumber } = req.body;

    if (!studentId || !roomNumber) {
      return res.status(400).json({
        message: "Student ID and room number are required",
      });
    }

    // Validate studentId
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({
        message: "Invalid student ID format",
      });
    }

    // Find the student to assign/update the room
    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Check if the student already has a room assigned
    const isUpdating = !!student.roomNumber;

    // Assign or update the room number
    student.roomNumber = roomNumber;
    await student.save();

    res.status(200).json({
      message: isUpdating
        ? `Room updated to ${roomNumber} for ${student.firstName} ${student.lastName}`
        : `Room ${roomNumber} assigned successfully to ${student.firstName} ${student.lastName}`,
      student: {
        id: student._id,
        firstName: student.firstName,
        lastName: student.lastName,
        roomNumber: student.roomNumber,
      },
    });
  } catch (error) {
    console.error("Error assigning or updating room:", error);
    res.status(500).json({ message: "Failed to assign or update room" });
  }
};

  

  