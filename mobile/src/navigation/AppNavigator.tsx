import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ThemeToggleButton } from '@/components/ThemeToggleButton';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { LoginScreen } from '@/screens/auth/LoginScreen';
import { RegisterScreen } from '@/screens/auth/RegisterScreen';
import { ForgotPasswordScreen } from '@/screens/auth/ForgotPasswordScreen';
import { ResetPasswordScreen } from '@/screens/auth/ResetPasswordScreen';
import {
  ApplyLeaveScreen,
  RoommatesScreen,
  StudentAnnouncementsScreen,
  StudentComplaintsScreen,
  StudentDashboardScreen,
  StudentLeavesScreen,
  StudentProfileScreen,
} from '@/screens/student';
import {
  AllLeavesScreen,
  AttendanceScreen,
  MessManagementScreen,
  PendingLeavesScreen,
  StaffAnnouncementsScreen,
  StaffComplaintsScreen,
  StaffDashboardScreen,
  StaffProfileScreen,
} from '@/screens/staff';
import {
  AdminAnnouncementsScreen,
  AdminComplaintsScreen,
  AdminDashboardScreen,
  AdminLeavesScreen,
  AdminMessScreen,
  CsvImportScreen,
  ManageParentsScreen,
  ManageStaffScreen,
  ManageStudentsScreen,
  RoomsScreen,
} from '@/screens/admin';
import {
  ParentAttendanceScreen,
  ParentComplaintsScreen,
  ParentDashboardScreen,
  ParentLeavesScreen,
  ParentProfileScreen,
} from '@/screens/parent';
import { hydrateAuth } from '@/store/slices/authSlice';
import { hydrateTheme } from '@/store/slices/themeSlice';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function StudentTabs() { return (<Tab.Navigator>
  <Tab.Screen name="StudentDashboard" component={StudentDashboardScreen} options={{ title: 'Dashboard' }} />
  <Tab.Screen name="ApplyLeave" component={ApplyLeaveScreen} options={{ title: 'Apply Leave' }} />
  <Tab.Screen name="StudentLeaves" component={StudentLeavesScreen} options={{ title: 'My Leaves' }} />
  <Tab.Screen name="StudentProfile" component={StudentProfileScreen} options={{ title: 'Profile' }} />
  <Tab.Screen name="StudentComplaints" component={StudentComplaintsScreen} options={{ title: 'Complaints' }} />
  <Tab.Screen name="Roommates" component={RoommatesScreen} options={{ title: 'Roommates' }} />
  <Tab.Screen name="StudentAnnouncements" component={StudentAnnouncementsScreen} options={{ title: 'Announcements' }} />
</Tab.Navigator>); }

function StaffTabs() { return (<Tab.Navigator>
  <Tab.Screen name="StaffDashboard" component={StaffDashboardScreen} options={{ title: 'Dashboard' }} />
  <Tab.Screen name="PendingLeaves" component={PendingLeavesScreen} options={{ title: 'Pending Leaves' }} />
  <Tab.Screen name="AllLeaves" component={AllLeavesScreen} options={{ title: 'All Leaves' }} />
  <Tab.Screen name="StaffComplaints" component={StaffComplaintsScreen} options={{ title: 'Complaints' }} />
  <Tab.Screen name="MessManagement" component={MessManagementScreen} options={{ title: 'Mess' }} />
  <Tab.Screen name="Attendance" component={AttendanceScreen} options={{ title: 'Attendance' }} />
  <Tab.Screen name="StaffProfile" component={StaffProfileScreen} options={{ title: 'Profile' }} />
  <Tab.Screen name="StaffAnnouncements" component={StaffAnnouncementsScreen} options={{ title: 'Announcements' }} />
</Tab.Navigator>); }

function ParentTabs() { return (<Tab.Navigator>
  <Tab.Screen name="ParentDashboard" component={ParentDashboardScreen} options={{ title: 'Dashboard' }} />
  <Tab.Screen name="ParentLeaves" component={ParentLeavesScreen} options={{ title: 'Leave Requests' }} />
  <Tab.Screen name="ParentAttendance" component={ParentAttendanceScreen} options={{ title: 'Attendance' }} />
  <Tab.Screen name="ParentProfile" component={ParentProfileScreen} options={{ title: 'Profile' }} />
  <Tab.Screen name="ParentComplaints" component={ParentComplaintsScreen} options={{ title: 'Complaints' }} />
</Tab.Navigator>); }

function AdminTabs() { return (<Tab.Navigator>
  <Tab.Screen name="AdminDashboard" component={AdminDashboardScreen} options={{ title: 'Dashboard' }} />
  <Tab.Screen name="ManageParents" component={ManageParentsScreen} options={{ title: 'Parents' }} />
  <Tab.Screen name="ManageStudents" component={ManageStudentsScreen} options={{ title: 'Students' }} />
  <Tab.Screen name="ManageStaff" component={ManageStaffScreen} options={{ title: 'Staff' }} />
  <Tab.Screen name="AdminLeaves" component={AdminLeavesScreen} options={{ title: 'Leaves' }} />
  <Tab.Screen name="Rooms" component={RoomsScreen} options={{ title: 'Rooms' }} />
  <Tab.Screen name="AdminComplaints" component={AdminComplaintsScreen} options={{ title: 'Complaints' }} />
  <Tab.Screen name="AdminMess" component={AdminMessScreen} options={{ title: 'Mess' }} />
  <Tab.Screen name="AdminAnnouncements" component={AdminAnnouncementsScreen} options={{ title: 'Announcements' }} />
  <Tab.Screen name="CsvImport" component={CsvImportScreen} options={{ title: 'CSV Import' }} />
</Tab.Navigator>); }

function RoleNavigator() {
  const role = useAppSelector((state) => state.auth.user?.role);
  const roleComponent = { student: StudentTabs, staff: StaffTabs, admin: AdminTabs, parent: ParentTabs }[role ?? 'student'];

  return (
    <Stack.Navigator screenOptions={{ headerRight: () => <ThemeToggleButton /> }}>
      <Stack.Screen name="Home" component={roleComponent} options={{ title: 'HMS Mobile' }} />
    </Stack.Navigator>
  );
}

function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerRight: () => <ThemeToggleButton /> }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
    </Stack.Navigator>
  );
}

export function AppNavigator() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const initializing = useAppSelector((state) => state.auth.initializing);

  React.useEffect(() => {
    dispatch(hydrateAuth());
    dispatch(hydrateTheme());
  }, [dispatch]);

  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <NavigationContainer>{isAuthenticated ? <RoleNavigator /> : <AuthNavigator />}</NavigationContainer>;
}
