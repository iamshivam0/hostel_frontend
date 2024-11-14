import { Request, Response } from "express";
import User from "../models/user.model.js";

export const createAdmin = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new admin user
    const admin = new User({
      email,
      password,
      firstName,
      lastName,
      role: "admin",
    });

    await admin.save();

    res.status(201).json({
      message: "Admin user created successfully",
      admin: {
        id: admin._id,
        email: admin.email,
        firstName: admin.firstName,
        lastName: admin.lastName,
        role: admin.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to create admin user" });
  }
};
