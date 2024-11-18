import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.routes.js";
// import userRoutes from "./routes/user.routes.js";
import adminRoutes from "./routes/admin.routes.js";
// import leaveRoutes from "./routes/leave.routes.js";
import parentRoutes from "./routes/parent.routes.js";
import studentRoutes from "./routes/student.routes.js";
import staffRoutes from "./routes/staff.routes.js";
// import complaintRoutes from "./routes/Complaint.routes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
// app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);

// app.use("/api/leaves", leaveRoutes);
app.use("/api/parent", parentRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/staff", staffRoutes);
// app.use("/api/complaints", complaintRoutes);

// Database connection
mongoose
  .connect(
    process.env.MONGODB_URI ||
      "mongodb+srv://shivamchandak009:eL540KvrMd37rpt3@cluster0.hvpqc.mongodb.net/"
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Basic error handling
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong!" });
  }
);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
