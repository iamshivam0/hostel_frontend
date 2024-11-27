import { Request, Response } from 'express';
import StudentAnnouncement from '../models/studentAnnouncment.model.js';
import GeneralAnnouncement from '../models/GeneralAnnouncment.model.js';
import User from '../models/user.model.js'; // Import User model for lookup

export const getStudentAnnouncements = async (req: Request, res: Response) => {
    try {
        const announcements = await StudentAnnouncement.find().sort({ createdAt: -1 });
        res.status(200).json(announcements);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching student announcements', error });
    }
};

export const postStudentAnnouncement = async (req: Request, res: Response) => {
    try {
        const { title, content, userId } = req.body;

        // Fetch the user's name
        const user = await User.findById(userId);
        if (!user || user.role !== 'student') {
            return res.status(400).json({ message: 'Only students can post announcements' });
        }

        const newAnnouncement = new StudentAnnouncement({
            title,
            content,
            studentName: `${user.firstName} ${user.lastName}`, // Save student's name
        });

        await newAnnouncement.save();
        res.status(201).json(newAnnouncement);
    } catch (error) {
        res.status(500).json({ message: 'Error posting student announcement', error });
    }
};
export const getGeneralAnnouncements = async (req: Request, res: Response) => {
    try {
        const announcements = await GeneralAnnouncement.find().sort({ createdAt: -1 });
        res.status(200).json(announcements);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching general announcements', error });
    }
};

export const postGeneralAnnouncement = async (req: Request, res: Response) => {
    try {
        const { title, content, userId, targetAudience } = req.body;

        // Fetch the staff user's name
        const user = await User.findById(userId);
        if (!user || user.role !== 'staff') {
            return res.status(400).json({ message: 'Only staff/admin can post general announcements' });
        }

        const newAnnouncement = new GeneralAnnouncement({
            title,
            content,
            staffName: `${user.firstName} ${user.lastName}`, // Save staff's name
            targetAudience,
        });

        await newAnnouncement.save();
        res.status(201).json(newAnnouncement);
    } catch (error) {
        res.status(500).json({ message: 'Error posting general announcement', error });
    }
};

//admin part 
export const getAllAnnouncements = async (req: Request, res: Response) => {
    try {
        const studentAnnouncements = await StudentAnnouncement.find().sort({ createdAt: -1 });
        const generalAnnouncements = await GeneralAnnouncement.find().sort({ createdAt: -1 });

        res.status(200).json({
            studentAnnouncements,
            generalAnnouncements,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching announcements', error });
    }
};

// Create a new announcement (student or general)
export const createAnnouncement = async (req: Request, res: Response) => {
    try {
        const { type, title, content, name, targetAudience } = req.body;

        let newAnnouncement;

        if (type === 'student') {
            newAnnouncement = new StudentAnnouncement({
                title,
                content,
                studentName: name,
            });
        } else if (type === 'general') {
            if (!targetAudience) {
                return res.status(400).json({ message: 'Target audience is required for general announcements' });
            }
            newAnnouncement = new GeneralAnnouncement({
                title,
                content,
                staffName: name,
                targetAudience,
            });
        } else {
            return res.status(400).json({ message: 'Invalid announcement type' });
        }

        await newAnnouncement.save();
        res.status(201).json(newAnnouncement);
    } catch (error) {
        res.status(500).json({ message: 'Error creating announcement', error });
    }
};

// Update an existing announcement (student or general)
export const updateAnnouncement = async (req: Request, res: Response) => {
    try {
        const { id, type } = req.params;
        const { title, content, name, targetAudience } = req.body;

        let updatedAnnouncement;

        if (type === 'student') {
            updatedAnnouncement = await StudentAnnouncement.findByIdAndUpdate(
                id,
                { title, content, studentName: name },
                { new: true }
            );
        } else if (type === 'general') {
            updatedAnnouncement = await GeneralAnnouncement.findByIdAndUpdate(
                id,
                { title, content, staffName: name, targetAudience },
                { new: true }
            );
        } else {
            return res.status(400).json({ message: 'Invalid announcement type' });
        }

        if (!updatedAnnouncement) {
            return res.status(404).json({ message: 'Announcement not found' });
        }

        res.status(200).json(updatedAnnouncement);
    } catch (error) {
        res.status(500).json({ message: 'Error updating announcement', error });
    }
};

// Delete an announcement (student or general)
export const deleteAnnouncement = async (req: Request, res: Response) => {
    try {
        const { id, type } = req.params;

        let deletedAnnouncement;

        if (type === 'student') {
            deletedAnnouncement = await StudentAnnouncement.findByIdAndDelete(id);
        } else if (type === 'general') {
            deletedAnnouncement = await GeneralAnnouncement.findByIdAndDelete(id);
        } else {
            return res.status(400).json({ message: 'Invalid announcement type' });
        }

        if (!deletedAnnouncement) {
            return res.status(404).json({ message: 'Announcement not found' });
        }

        res.status(200).json({ message: 'Announcement deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting announcement', error });
    }
};