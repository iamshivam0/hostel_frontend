import { FeatureItem, UserRole } from '@/types';

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'https://hostel-backend-new.onrender.com';
export const ENCRYPTION_KEY = process.env.EXPO_PUBLIC_ENCRYPTION_KEY || 'thisisthekey';

export const roleFeatureMap: Record<UserRole, FeatureItem[]> = {
  student: [
    { title: 'Dashboard', description: 'Leave stats and mess updates', route: 'StudentDashboard' },
    { title: 'Apply Leave', description: 'Submit a new leave request', route: 'ApplyLeave' },
    { title: 'My Leaves', description: 'Track your leave history', route: 'StudentLeaves' },
    { title: 'Profile', description: 'View and update your profile', route: 'StudentProfile' },
    { title: 'Complaints', description: 'Raise and track complaints', route: 'StudentComplaints' },
    { title: 'Roommates', description: 'See your roommate details', route: 'Roommates' },
    { title: 'Announcements', description: 'Read latest notifications', route: 'StudentAnnouncements' },
  ],
  staff: [
    { title: 'Dashboard', description: 'Quick staff insights', route: 'StaffDashboard' },
    { title: 'Pending Leaves', description: 'Review leave approvals', route: 'PendingLeaves' },
    { title: 'All Leaves', description: 'Monitor all leave records', route: 'AllLeaves' },
    { title: 'Complaints', description: 'Resolve hostel complaints', route: 'StaffComplaints' },
    { title: 'Mess Management', description: 'Update mess menu', route: 'MessManagement' },
    { title: 'Attendance', description: 'Manage attendance records', route: 'Attendance' },
    { title: 'Profile', description: 'Maintain your profile', route: 'StaffProfile' },
    { title: 'Announcements', description: 'Post announcements', route: 'StaffAnnouncements' },
  ],
  admin: [
    { title: 'Dashboard', description: 'Complete system overview', route: 'AdminDashboard' },
    { title: 'Manage Parents', description: 'Assign and manage parents', route: 'ManageParents' },
    { title: 'Manage Students', description: 'Create and edit students', route: 'ManageStudents' },
    { title: 'Manage Staff', description: 'Create and edit staff', route: 'ManageStaff' },
    { title: 'Leaves', description: 'Monitor leave records', route: 'AdminLeaves' },
    { title: 'Rooms', description: 'Assign and review room inventory', route: 'Rooms' },
    { title: 'Complaints', description: 'Track all complaints', route: 'AdminComplaints' },
    { title: 'Mess', description: 'View and update mess management', route: 'AdminMess' },
    { title: 'Announcements', description: 'Publish campus announcements', route: 'AdminAnnouncements' },
    { title: 'CSV Import', description: 'Bulk import records', route: 'CsvImport' },
  ],
  parent: [
    { title: 'Dashboard', description: 'Child hostel activity summary', route: 'ParentDashboard' },
    { title: 'Leave Requests', description: 'Review child leave requests', route: 'ParentLeaves' },
    { title: 'Attendance', description: 'Check attendance summary', route: 'ParentAttendance' },
    { title: 'Profile', description: 'Update your profile', route: 'ParentProfile' },
    { title: 'Complaints', description: 'Submit parent complaints', route: 'ParentComplaints' },
  ],
};
