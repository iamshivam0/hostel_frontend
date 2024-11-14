"use client";

import React, { useEffect, useState } from "react";
import { getUser } from "@/app/utils/auth";
import { User } from "@/app/types/user";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/app/config/api";

interface Leave {
  _id: string;
  startDate: string;
  endDate: string;
  leaveType: string;
  reason: string;
  status: string;
  contactNumber: string;
  parentContact: string;
  address: string;
  staffRemarks: string;
  createdAt: string;
}

export default function ShowLeaves() {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const user = getUser() as User | null;

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    fetchLeaves();
  }, [router]);

  const fetchLeaves = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/leaves/my-leaves`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch leaves");
      }
      const data = await response.json();
      setLeaves(data);
    } catch (error) {
      console.error("Error fetching leaves:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800";
      default:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800";
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              Leave Applications
            </h1>
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Loading your leave applications...
            </p>
          </div>
        ) : leaves.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
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
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
              No leaves found
            </h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              You haven't applied for any leaves yet.
            </p>
            <button
              onClick={() => router.push("/student/apply-leave")}
              className="mt-6 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              Apply for Leave
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {leaves.map((leave) => (
              <div
                key={leave._id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-shadow duration-200"
              >
                <div className="p-6">
                  <div className="flex flex-wrap gap-4 items-start justify-between mb-6">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                          {leave.leaveType.charAt(0).toUpperCase() +
                            leave.leaveType.slice(1)}{" "}
                          Leave
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                            leave.status
                          )}`}
                        >
                          {leave.status.charAt(0).toUpperCase() +
                            leave.status.slice(1)}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Applied on:{" "}
                        {new Date(leave.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Duration
                        </h4>
                        <div className="flex items-center gap-3 text-gray-900 dark:text-white">
                          <span>
                            {new Date(leave.startDate).toLocaleDateString()}
                          </span>
                          <span className="text-gray-400">→</span>
                          <span>
                            {new Date(leave.endDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Contact Information
                        </h4>
                        <div className="space-y-2">
                          <p className="text-gray-900 dark:text-white">
                            <span className="text-gray-600 dark:text-gray-400">
                              Your Contact:{" "}
                            </span>
                            {leave.contactNumber}
                          </p>
                          <p className="text-gray-900 dark:text-white">
                            <span className="text-gray-600 dark:text-gray-400">
                              Parent's Contact:{" "}
                            </span>
                            {leave.parentContact}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Address During Leave
                        </h4>
                        <p className="text-gray-900 dark:text-white">
                          {leave.address}
                        </p>
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Reason
                        </h4>
                        <p className="text-gray-900 dark:text-white">
                          {leave.reason}
                        </p>
                      </div>
                    </div>
                  </div>

                  {leave.staffRemarks && (
                    <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-4">
                      <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
                        Staff Remarks
                      </h4>
                      <p className="text-blue-900 dark:text-blue-100">
                        {leave.staffRemarks}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
