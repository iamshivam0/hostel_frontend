import React from 'react';
import { PortalHomeScreen } from '@/screens/common/PortalHomeScreen';
import { FeaturePlaceholderScreen } from '@/screens/common/FeaturePlaceholderScreen';

export const AdminDashboardScreen = () => <PortalHomeScreen role="admin" />;
export const ManageParentsScreen = () => <FeaturePlaceholderScreen title="Manage Parents" description="Create, assign, and edit parent records." />;
export const ManageStudentsScreen = () => <FeaturePlaceholderScreen title="Manage Students" description="Create, update, and deactivate student records." />;
export const ManageStaffScreen = () => <FeaturePlaceholderScreen title="Manage Staff" description="Create, update, and deactivate staff records." />;
export const AdminLeavesScreen = () => <FeaturePlaceholderScreen title="Admin Leaves" description="Review leave metrics and full logs." />;
export const RoomsScreen = () => <FeaturePlaceholderScreen title="Rooms" description="Assign rooms and monitor occupancy." />;
export const AdminComplaintsScreen = () => <FeaturePlaceholderScreen title="Complaints" description="Monitor complaint lifecycle system-wide." />;
export const AdminMessScreen = () => <FeaturePlaceholderScreen title="Mess" description="Oversee mess operations and updates." />;
export const AdminAnnouncementsScreen = () => <FeaturePlaceholderScreen title="Announcements" description="Create and broadcast announcements." />;
export const CsvImportScreen = () => <FeaturePlaceholderScreen title="CSV Import" description="Bulk import student/staff/parent data." />;
