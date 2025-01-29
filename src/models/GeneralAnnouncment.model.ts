import mongoose, { Schema, Document } from 'mongoose';

export interface IGeneralAnnouncement extends Document {
    title: string;
    content: string;
    staffName: string; // Derived from the User model
    targetAudience: 'students' | 'staff' | 'all';
    createdAt: Date;
}

const GeneralAnnouncementSchema: Schema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    staffName: { type: String, required: true }, // Stored directly in the model
    targetAudience: { type: String, enum: ['students', 'staff', 'all'], required: true },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IGeneralAnnouncement>('GeneralAnnouncement', GeneralAnnouncementSchema);
