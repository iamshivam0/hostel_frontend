"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser, logout, hasRole } from "@/app/utils/auth";
import { useTheme } from "@/app/providers/theme-provider";
import { User } from "@/app/types/user";

export default function AdminDashboard() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [user, setUser] = useState<User | null>(getUser() as User | null);

  useEffect(() => {
    if (!user || !hasRole(["admin"])) {
      router.push("/login");
      return;
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Navigation Bar */}
      <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-300 text-transparent bg-clip-text">
                HMS
              </h1>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                |
              </span>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Admin
              </span>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                {theme === "dark" ? "🌞" : "🌙"}
              </button>
              <button
                onClick={logout}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 rounded-xl transition-all duration-200"
              >
                <span className="hidden sm:inline">Logout</span>
                <span className="sm:hidden">↪️</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-2xl p-4 sm:p-8 text-white shadow-lg">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">
              Welcome back, {user.firstName} 👋
            </h2>
            <p className="text-blue-100 text-sm sm:text-base">
              Manage all hostel operations from your admin dashboard.
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <button
            onClick={() => router.push("/admin/manage-parents")}
            className="group p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200 dark:border-gray-700 flex flex-col items-center text-center hover:scale-105"
          >
            <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-200">
              <svg
                className="w-8 h-8 text-blue-600 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Manage Parents
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Assign and manage parent-student relationships
            </p>
          </button>

          <button
            onClick={() => router.push("/admin/manage-students")}
            className="group p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200 dark:border-gray-700 flex flex-col items-center text-center hover:scale-105"
          >
            <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-200">
              <svg
                className="w-8 h-8 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Manage Students
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              View and manage student information
            </p>
          </button>

          <button
            onClick={() => router.push("/admin/manage-staff")}
            className="group p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200 dark:border-gray-700 flex flex-col items-center text-center hover:scale-105"
          >
            <div className="p-4 bg-purple-100 dark:bg-purple-900/30 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-200">
              <svg
                className="w-8 h-8 text-purple-600 dark:text-purple-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Manage Staff
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Manage hostel staff members
            </p>
          </button>

          <button
            onClick={() => router.push("/admin/leaves")}
            className="group p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200 dark:border-gray-700 flex flex-col items-center text-center hover:scale-105"
          >
            <div className="p-4 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-200">
              <svg
                className="w-8 h-8 text-yellow-600 dark:text-yellow-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Leave Management
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Review and manage leave requests
            </p>
          </button>

          <button
            onClick={() => router.push("/admin/rooms")}
            className="group p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200 dark:border-gray-700 flex flex-col items-center text-center hover:scale-105"
          >
            <div className="p-4 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-200">
              <svg
                className="w-8 h-8 text-indigo-600 dark:text-indigo-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Room Management
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Manage hostel rooms and assignments
            </p>
          </button>

          <button
            onClick={() => router.push("/admin/complaints")}
            className="group p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200 dark:border-gray-700 flex flex-col items-center text-center hover:scale-105"
          >
            <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-200">
              <svg
                className="w-8 h-8 text-red-600 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Complaints
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              View and handle student complaints
            </p>
          </button>

          <button
            onClick={() => router.push("/admin/mess")}
            className="group p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200 dark:border-gray-700 flex flex-col items-center text-center hover:scale-105"
          >
            <div className="p-4 bg-orange-100 dark:bg-orange-900/30 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-200">
              <svg
                className="w-8 h-8 text-orange-600 dark:text-orange-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Mess Management
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Manage mess menu and schedules
            </p>
          </button>
          <button
            onClick={() => router.push("/admin/announcement")}
            className="group p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200 dark:border-gray-700 flex flex-col items-center text-center hover:scale-105"
          >
            <div className="p-4 bg-purple-100 dark:bg-purple-900/30 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-200">
              <svg
                className="w-8 h-8 text-purple-600 dark:text-purple-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Announcements
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Manage and post announcements
            </p>
          </button>
          <button
            onClick={() => router.push("/admin/add-csv")}
            className="group p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200 dark:border-gray-700 flex flex-col items-center text-center hover:scale-105"
          >
            <div className="p-4 bg-purple-100 dark:bg-purple-900/30 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                id="upload"
              >
                <path d="M5 10c-.6 0-1-.4-1-1 0-3.9 3.1-7 7-7 3 0 5.7 2 6.7 4.9.1.5-.1 1.1-.7 1.2-.5.2-1.1-.1-1.3-.6C15.1 5.4 13.2 4 11 4 8.2 4 6 6.2 6 9c0 .6-.4 1-1 1z"></path>
                <path d="M18 18c-.6 0-1-.4-1-1s.4-1 1-1c2.2 0 4-1.8 4-4s-1.8-4-4-4c-.3 0-.7 0-1 .1-.5.1-1.1-.2-1.2-.7s.2-1.1.7-1.2c.5-.1 1-.2 1.5-.2 3.3 0 6 2.7 6 6s-2.7 6-6 6zM8 18H5c-.6 0-1-.4-1-1s.4-1 1-1h3c.6 0 1 .4 1 1s-.4 1-1 1z"></path>
                <path d="M18 18h-2c-.6 0-1-.4-1-1s.4-1 1-1h2c.6 0 1 .4 1 1s-.4 1-1 1zM5 18c-2.8 0-5-2.2-5-5s2.2-5 5-5c.6 0 1 .4 1 1s-.4 1-1 1c-1.7 0-3 1.3-3 3s1.3 3 3 3c.6 0 1 .4 1 1s-.4 1-1 1zm7 4c-.6 0-1-.4-1-1V11c0-.6.4-1 1-1s1 .4 1 1v10c0 .6-.4 1-1 1z"></path>
                <path d="M9 15c-.3 0-.5-.1-.7-.3-.4-.4-.4-1 0-1.4l3-3c.4-.4 1-.4 1.4 0s.4 1 0 1.4l-3 3c-.2.2-.4.3-.7.3z"></path>
                <path d="M15 15c-.3 0-.5-.1-.7-.3l-3-3c-.4-.4-.4-1 0-1.4s1-.4 1.4 0l3 3c.4.4.4 1 0 1.4-.2.2-.4.3-.7.3z"></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Import CSV data
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Manage and Add Data from CSV
            </p>
          </button>
        </div>
      </main>
    </div>
  );
}
