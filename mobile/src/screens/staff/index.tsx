import React from 'react';
import { PortalHomeScreen } from '@/screens/common/PortalHomeScreen';
import { FeaturePlaceholderScreen } from '@/screens/common/FeaturePlaceholderScreen';

export const StaffDashboardScreen = () => <PortalHomeScreen role="staff" />;
export const PendingLeavesScreen = () => (
  <FeaturePlaceholderScreen title="Pending Leaves" description="Approve or reject pending student leave requests." />
);
export const AllLeavesScreen = () => (
  <FeaturePlaceholderScreen title="All Leaves" description="View all leave requests across hostels." />
);
export const StaffComplaintsScreen = () => (
  <FeaturePlaceholderScreen title="Complaints" description="Manage open complaints and update statuses." />
);
export const MessManagementScreen = () => (
  <FeaturePlaceholderScreen title="Mess Management" description="Upload and manage mess menu items." />
);
export const AttendanceScreen = () => (
  <FeaturePlaceholderScreen title="Attendance" description="Record and review attendance logs." />
);
export const StaffProfileScreen = () => (
  <FeaturePlaceholderScreen title="Staff Profile" description="Edit profile and change password." />
);
export const StaffAnnouncementsScreen = () => (
  <FeaturePlaceholderScreen title="Announcements" description="Create and publish staff announcements." />
);
