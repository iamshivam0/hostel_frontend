import mongoose, { Schema, Document } from 'mongoose';

export interface IStudentAnnouncement extends Document {
    title: string;
    content: string;
    studentName: string; // Derived from the User model
    createdAt: Date;
}

const StudentAnnouncementSchema: Schema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    studentName: { type: String, required: true }, // Stored directly in the model
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IStudentAnnouncement>('StudentAnnouncement', StudentAnnouncementSchema);
