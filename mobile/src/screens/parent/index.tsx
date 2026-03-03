import React from 'react';
import { PortalHomeScreen } from '@/screens/common/PortalHomeScreen';
import { FeaturePlaceholderScreen } from '@/screens/common/FeaturePlaceholderScreen';

export const ParentDashboardScreen = () => <PortalHomeScreen role="parent" />;
export const ParentLeavesScreen = () => <FeaturePlaceholderScreen title="Leave Requests" description="Review and approve child leave requests." />;
export const ParentAttendanceScreen = () => <FeaturePlaceholderScreen title="Attendance" description="Track child hostel attendance." />;
export const ParentProfileScreen = () => <FeaturePlaceholderScreen title="Parent Profile" description="Update profile information and password." />;
export const ParentComplaintsScreen = () => <FeaturePlaceholderScreen title="Complaints" description="Raise hostel complaints as parent." />;
