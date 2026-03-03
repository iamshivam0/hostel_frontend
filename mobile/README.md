# HMS Mobile (React Native + Expo)

This folder contains a production-oriented React Native scaffold mirroring the HMS web modules with role-based portals.

## Included modules

- Authentication: Login, Register, Forgot Password, Reset Password
- Student portal: Dashboard, Apply Leave, Leaves, Profile, Complaints, Roommates, Announcements
- Staff portal: Dashboard, Pending Leaves, All Leaves, Complaints, Mess, Attendance, Profile, Announcements
- Admin portal: Dashboard, Manage Parents/Students/Staff, Leaves, Rooms, Complaints, Mess, Announcements, CSV Import
- Parent portal: Dashboard, Leave Requests, Attendance, Profile, Complaints
- Common: Theme toggle, menu modal, announcement modal, persisted auth + theme state

## Tech stack

- Expo + React Native + TypeScript
- React Native Paper
- React Navigation (stack + tabs)
- Redux Toolkit + React Redux
- AsyncStorage

## Environment variables

Create `mobile/.env`:

```bash
EXPO_PUBLIC_API_BASE_URL=https://hostel-backend-new.onrender.com
```

## Run locally

```bash
cd mobile
npm install
npm start
```

## Current status

- Login is wired to `/api/auth/login` and persists token/user to local storage.
- Feature screens are scaffolded with reusable placeholder pages and can now be integrated one-by-one with backend endpoints.
