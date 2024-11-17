import mongoose, { Schema, Document } from "mongoose";

export interface IComplaint extends Document {
  student: mongoose.Types.ObjectId; // Reference to User
  description: string;
  status: string;
  studentDetails: {
    firstName: string;
    roomNumber: string;

  };
  createdAt?: Date;
  updatedAt?: Date;
}

const complaintSchema = new Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ["Pending", "Resolved"], default: "Pending" },
    studentDetails: {
      firstName: { type: String, required: true },
      roomNumber: { type: String, required: true },
    },
  },
  { timestamps: true }
);

export default mongoose.model<IComplaint>("Complaint", complaintSchema);
