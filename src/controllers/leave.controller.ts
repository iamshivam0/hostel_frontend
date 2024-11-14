import { Request, Response } from "express";
import Leave from "../models/leave.model.js";
import User from "../models/user.model.js";

export const submitLeave = async (req: Request, res: Response) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const newLeave = new Leave({
      ...req.body,
      studentId: req.user._id,
    });
    await newLeave.save();
    res
      .status(201)
      .json({ message: "Leave application submitted successfully" });
  } catch (error) {
    console.error("Leave submission error:", error);
    res.status(500).json({ message: "Error submitting leave application" });
  }
};

export const getStudentLeaves = async (req: Request, res: Response) => {
  //   const { studentId } = req.params;
  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const leaves = await Leave.find({ studentId: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json(leaves);
  } catch (error) {
    res.status(500).json({ message: "Error fetching leave applications" });
  }
};

export const getAllLeaves = async (req: Request, res: Response) => {
  try {
    const leaves = await Leave.find()
      .populate("studentId", "firstName lastName email")
      .populate("reviewedBy", "firstName lastName")
      .sort({ createdAt: -1 });
    res.status(200).json(leaves);
  } catch (error) {
    res.status(500).json({ message: "Error fetching leave applications" });
  }
};

export const reviewLeave = async (req: Request, res: Response) => {
  const { leaveId } = req.params;
  const { action, remarks } = req.body;

  try {
    if (!req.user?._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const leave = await Leave.findByIdAndUpdate(
      leaveId,
      {
        status: action === "approve" ? "approved" : "rejected",
        staffRemarks: remarks,
        reviewedBy: req.user._id,
        reviewedAt: new Date(),
      },
      { new: true }
    );

    if (!leave) {
      return res.status(404).json({ message: "Leave application not found" });
    }

    res
      .status(200)
      .json({ message: "Leave application reviewed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error reviewing leave application" });
  }
};

export const getPendingLeaves = async (req: Request, res: Response) => {
  try {
    const leaves = await Leave.find({ status: "pending" })
      .populate("studentId", "firstName lastName email")
      .populate("reviewedBy", "firstName lastName")
      .sort({ createdAt: -1 });
    res.status(200).json(leaves);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching pending leave applications" });
  }
};
