"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getUser, hasRole } from "@/app/utils/auth";
import { useAuth } from "@/app/contexts/AuthContext";
import { useTheme } from "@/app/providers/theme-provider";
import type { User } from "@/app/types/user";
import NotificationsBell from "@/app/components/NotificationsBell";
import EnableNotificationsButton from "@/app/components/EnableNotificationsButton";

export default function OrgAdminDashboardPage() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const u = getUser();
    if (!u) {
      router.replace("/login");
      return;
    }
    if (!hasRole(["admin"])) {
      router.replace("/login");
      return;
    }
    setUser(u);
  }, [router]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-300 text-transparent bg-clip-text">
                NIVAS
              </h1>
              <span className="text-sm text-gray-500 dark:text-gray-400">|</span>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Org Admin
              </span>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <EnableNotificationsButton />
              <NotificationsBell
                announcementsApiPath="/api/admin/announcements"
                viewAllHref="/admin/announcement/view"
                createHref="/admin/announcement/create"
              />
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? "🌞" : "🌙"}
              </button>
              <button
                onClick={() => void logout()}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 rounded-xl transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-2xl p-4 sm:p-8 text-white shadow-lg">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">
              Welcome, {user.firstName} 👋
            </h2>
            <p className="text-blue-100 text-sm sm:text-base">
              Organization Admin dashboard. Create hostels and add hostel admins.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/org-admin/hostels"
            className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Hostels
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              List and create hostels
            </p>
          </Link>
          <Link
            href="/admin/announcement/view"
            className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Announcements
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              View and create announcements for staff, students and parents
            </p>
          </Link>
          <Link
            href="/org-admin/users"
            className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Users
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Add or update users (staff, admin)
            </p>
          </Link>
          <Link
            href="/org-admin/hostel-admins"
            className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Hostel Admins
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              View and assign users to hostels
            </p>
          </Link>
        </div>
      </main>
    </div>
  );
}
