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
import passwordroutes from "./routes/passwordreset.routes.js";
// import complaintRoutes from "./routes/Complaint.routes.js";
import axios from "axios";
import cron from "node-cron";
import "./config/Cloudinary.js";
dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://hostel-backend-new.onrender.com",
      "https://hostel-frontend-fx5j.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 200,
  })
);

cron.schedule("*/15 * * * *", async () => {
  // if (!BACKEND_URL) {
  //   console.warn("Health check URL not configured, skipping health check");
  //   return;
  // }

  try {
    const response = await axios.get("https://hostel-backend-new.onrender.com");
    console.log(`Health check successful - Status: ${response.status}`);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error(`Health check failed: ${errorMessage}`);
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Welcome to Hostel Management System API");
});

// Routes
app.use("/api/auth", authRoutes);
// app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);

// app.use("/api/leaves", leaveRoutes);
app.use("/api/parent", parentRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/password", passwordroutes);
// app.use("/api/complaints", complaintRoutes);

// Database connection
mongoose
  .connect(process.env.MONGODB_URI || "")
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
