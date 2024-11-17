import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import User from "../models/user.model.js";

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ success: false, message: "Unauthorized" });

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    req.user = { _id: user._id, role: user.role }; 
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};
// import { Request, Response, NextFunction } from "express";

export const isStudent = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role === "student") return next();
  res.status(403).json({ success: false, message: "Access denied" });
};

export const isStaff = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role === "staff") return next();
  res.status(403).json({ success: false, message: "Access denied" });
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role === "admin") return next();
  res.status(403).json({ success: false, message: "Access denied" });
};
