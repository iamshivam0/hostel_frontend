"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser, logout, hasRole } from "@/app/utils/auth";
import { useTheme } from "@/app/providers/theme-provider";
import { User } from "@/app/types/user";

export default function StaffDashboard() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const user = getUser() as User | null;

  useEffect(() => {
    if (!user || !hasRole(["staff"])) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <nav className="bg-white shadow-lg dark:bg-gray-800">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Staff Dashboard
              </h1>
            </div>
            <div className="flex gap-4 items-center">
              <button
                onClick={toggleTheme}
                className="p-2 bg-gray-200 rounded-lg dark:bg-gray-700"
              >
                {theme === "dark" ? "🌞" : "🌙"}
              </button>
              <button
                onClick={logout}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Welcome, {user.firstName} {user.lastName}
          </h2>
          <div className="grid grid-cols-1 gap-6 mt-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Pending Leaves Box */}
            <button
              onClick={() => router.push("/staff/leaves")}
              className="flex flex-col justify-center items-center p-6 bg-white rounded-lg shadow-md transition-shadow duration-300 dark:bg-gray-800 hover:shadow-lg aspect-square"
            >
              <svg
                className="mb-4 w-12 h-12 text-yellow-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-lg font-medium text-gray-900 dark:text-white">
                Pending Leaves
              </span>
              <span className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Review pending leave applications
              </span>
            </button>

            {/* All Leaves Box */}
            <button
              onClick={() => router.push("/staff/allleaves")}
              className="flex flex-col justify-center items-center p-6 bg-white rounded-lg shadow-md transition-shadow duration-300 dark:bg-gray-800 hover:shadow-lg aspect-square"
            >
              <svg
                className="mb-4 w-12 h-12 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <span className="text-lg font-medium text-gray-900 dark:text-white">
                All Leaves
              </span>
              <span className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                View all leave applications
              </span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
