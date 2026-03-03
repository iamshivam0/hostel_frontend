import React from 'react';
import { PortalHomeScreen } from '@/screens/common/PortalHomeScreen';
import { FeaturePlaceholderScreen } from '@/screens/common/FeaturePlaceholderScreen';

export const StudentDashboardScreen = () => <PortalHomeScreen role="student" />;
export const ApplyLeaveScreen = () => (
  <FeaturePlaceholderScreen title="Apply Leave" description="Student leave request form with date range and reason." />
);
export const StudentLeavesScreen = () => (
  <FeaturePlaceholderScreen title="My Leaves" description="Track leave request statuses and history." />
);
export const StudentProfileScreen = () => (
  <FeaturePlaceholderScreen title="Student Profile" description="Update profile, password, and profile picture." />
);
export const StudentComplaintsScreen = () => (
  <FeaturePlaceholderScreen title="Student Complaints" description="Create, edit, and view complaint tickets." />
);
export const RoommatesScreen = () => (
  <FeaturePlaceholderScreen title="Roommates" description="View assigned roommates and room details." />
);
export const StudentAnnouncementsScreen = () => (
  <FeaturePlaceholderScreen title="Announcements" description="Read student announcements in a modal/list flow." />
);
