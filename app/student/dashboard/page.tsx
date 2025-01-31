"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser, logout, hasRole } from "@/app/utils/auth";
import { useTheme } from "@/app/providers/theme-provider";
import { User } from "@/app/types/user";
import { API_BASE_URL } from "@/app/config/api";
import MenuModal from "@/app/components/MenuModal";
import AnnouncementModal from "@/app/components/studentAnnouncementModel";

interface Leave {
  _id: string;
  status: string;
  // ... other leave properties
}

export default function StudentDashboard() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [user, setUser] = useState<User | null>(getUser() as User | null);
  const [leaveStats, setLeaveStats] = useState({
    pending: 0,
    approved: 0,
    total: 0,
  });
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [menuImage, setMenuImage] = useState<string | null>(null);
  const [profile, setProfile] = useState<string | null>(null);
  // Declare formData and setFormData
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    roomNumber: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    profilePicUrl: "", // Make sure this is correctly initialized
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  useEffect(() => {
    if (!user || !hasRole(["student"])) {
      router.push("/login");
      return;
    }
    fetchLeaveStats();
  }, [user, router]);

  const fetchLeaveStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/student/leave-stats`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch leave stats");
      }

      const stats = await response.json();
      setLeaveStats(stats);
    } catch (error) {
      console.error("Error fetching leave stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMenuImage = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/student/mess-menu`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch menu");
      }

      const data = await response.json();
      if (data.url) {
        setMenuImage(data.url);
      }
    } catch (error) {
      console.error("Error fetching menu:", error);
    }
  };

  useEffect(() => {
    if (isMenuModalOpen) {
      fetchMenuImage();
    }
  }, [isMenuModalOpen]);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/student/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch profile data");
      }

      const profileData = await response.json();
      // console.log(profileData);

      // Set profilePicUrl to both profile state and the user state
      setProfile(profileData.profilePicUrl);
      setUser((prevUser) => ({
        ...prevUser!, // Spread the previous user object
        profileImage: profileData.profilePicUrl, // Update only the profileImage field
      }));

      // Optionally, store the updated user object in localStorage
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...user,
          profileImage: profileData.profilePicUrl, // Save the updated profile image URL
        })
      );
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        console.log("Profile picture URL:", userData.profileImage);
      } else {
        console.log("User is not found in localStorage.");
      }

      setFormData((prev) => ({
        ...prev,
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        email: profileData.email,
        roomNumber: profileData.roomNumber || "",
        profilePicUrl: profileData.profilePicUrl || "",
      }));
      // console.log(profileData.profilePicUrl);

      // Update the preview
      setImagePreview(profileData.profilePicUrl || "");
    } catch (error) {
      console.error(
        error instanceof Error ? error.message : "Failed to fetch user profile"
      );
    }
  };
  useEffect(() => {
    fetchUserProfile();
  }, []);

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
                Student
              </span>
            </div>
            {/* Mobile-optimized buttons */}
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={() => setIsAnnouncementModalOpen(true)}
                className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <span className="hidden sm:inline">📢 Announcements</span>
                <span className="sm:hidden">📢</span>
              </button>
              <button
                onClick={() => setIsMenuModalOpen(true)}
                className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <span className="hidden sm:inline">View Menu</span>
                <span className="sm:hidden">🍽️</span>
              </button>
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
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              {/* Profile Image */}
              <div className="flex-shrink-0">
                <img
                  src={imagePreview || "/default-avatar.png"}
                  alt={`${user.firstName}'s profile`}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-white/20 object-cover"
                />
              </div>

              {/* Welcome Text */}
              <div className="text-center sm:text-left">
                <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                  Welcome back, {user.firstName} 👋
                </h2>
                <p className="text-blue-100">
                  Room Number: <strong>{user.roomNumber}</strong>
                </p>
                <p className="text-blue-100 text-sm sm:text-base">
                  Access all your hostel services from your personal dashboard.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <svg
                  className="w-6 h-6 text-blue-600 dark:text-blue-400"
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
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Pending Leaves
                </p>
                {loading ? (
                  <div className="h-8 w-8 animate-pulse bg-gray-200 dark:bg-gray-700 rounded mt-1"></div>
                ) : (
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {leaveStats.pending}
                  </h3>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <svg
                  className="w-6 h-6 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Approved Leaves
                </p>
                {loading ? (
                  <div className="h-8 w-8 animate-pulse bg-gray-200 dark:bg-gray-700 rounded mt-1"></div>
                ) : (
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {leaveStats.approved}
                  </h3>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <svg
                  className="w-6 h-6 text-purple-600 dark:text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Leaves
                </p>
                {loading ? (
                  <div className="h-8 w-8 animate-pulse bg-gray-200 dark:bg-gray-700 rounded mt-1"></div>
                ) : (
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {leaveStats.total}
                  </h3>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <button
            onClick={() => router.push("/student/apply-leave")}
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Apply for Leave
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Submit a new leave application
            </p>
          </button>

          <button
            onClick={() => router.push("/student/showleaves")}
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
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              View Leaves
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Check your leave history
            </p>
          </button>

          <button
            onClick={() => router.push("/student/profile")}
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
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              My Profile
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              View and edit your profile
            </p>
          </button>

          <button
            onClick={() => router.push("/student/myroommates")}
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
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              My Roommates
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              View your roommates
            </p>
          </button>
          <button
            onClick={() => router.push("/student/complaints")}
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
              My Complaints
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              View all your complaints
            </p>
          </button>
          <button
            onClick={() => router.push("/student/announcement")}
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
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 14l2 2 4-4"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Create announcement
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              work in progress
            </p>
          </button>
          <button className="group p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200 dark:border-gray-700 flex flex-col items-center text-center hover:scale-105">
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
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 14l2 2 4-4"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              My Attendance
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              work in progress
            </p>
          </button>
        </div>
      </main>

      <MenuModal
        isOpen={isMenuModalOpen}
        onClose={() => setIsMenuModalOpen(false)}
        menuUrl={menuImage}
      />
      <AnnouncementModal
        isOpen={isAnnouncementModalOpen}
        onClose={() => setIsAnnouncementModalOpen(false)}
      />
    </div>
  );
}
