"use client";
import { API_BASE_URL } from "@/app/config/api";
import React, { useEffect, useState } from "react";
import { getToken } from "@/app/utils/auth";
import { useRouter } from "next/navigation";

interface Leave {
  _id: string;
  startDate: string;
  endDate: string;
  reason: string;
  leaveType: string;
  contactNumber: string;
  parentContact: string;
  address: string;
  status: string;
  staffRemarks: string;
  createdAt: string;
  reviewedAt?: string;
  studentId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  reviewedBy?: {
    _id: string;
    firstName: string;
    lastName: string;
  };
}

const PendingLeaves = () => {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchLeaves = async () => {
    try {
      const token = getToken();
      const response = await fetch(`${API_BASE_URL}/api/staff/leaves/pending`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch leaves");
      }

      const data = await response.json();
      const leavesData = data.leaves || data;

      if (Array.isArray(leavesData)) {
        setLeaves(leavesData);
      } else {
        throw new Error("Invalid data format received");
      }
    } catch (error) {
      console.error("Error fetching leaves:", error);
      setError(
        error instanceof Error ? error.message : "Failed to fetch leaves"
      );
    } finally {
      setLoading(false);
    }
  };
  const handleAction = async (
    leaveId: string,
    action: "approve" | "reject",
    remarks: string
  ) => {
    try {
      const token = getToken();
      const response = await fetch(
        `${API_BASE_URL}/api/staff/leaves/${leaveId}/review`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ action, remarks }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to ${action} leave`);
      }

      // Show success message
      alert(`Leave ${action}ed successfully`);

      // Refresh the leaves list
      fetchLeaves();
    } catch (error) {
      console.error(`Error ${action}ing leave:`, error);
      alert(`Failed to ${action} leave. Please try again.`);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Navigation */}
      <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              Pending Leave Applications
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
              Loading pending applications...
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
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
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
              Error loading leaves
            </h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">{error}</p>
            <button
              onClick={fetchLeaves}
              className="mt-6 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        ) : leaves.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
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
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
              All caught up!
            </h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              No pending leave applications to review.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {leaves.map((leave) => (
              <div
                key={leave._id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-200"
              >
                <div className="p-6">
                  {/* Header Section */}
                  <div className="flex flex-wrap gap-4 items-start justify-between mb-6">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <span className="text-blue-600 dark:text-blue-400 font-medium">
                            {leave.studentId?.firstName?.[0]}
                            {leave.studentId?.lastName?.[0]}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {leave.studentId?.firstName || "Unknown"}{" "}
                            {leave.studentId?.lastName || "Student"}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {leave.studentId?.email || "No email provided"}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Applied on:{" "}
                        {new Date(leave.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <span className="px-4 py-2 rounded-xl text-sm font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800">
                      {leave.leaveType.charAt(0).toUpperCase() +
                        leave.leaveType.slice(1)}{" "}
                      Leave
                    </span>
                  </div>

                  {/* Content Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-4">
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Leave Details
                        </h4>
                        <div className="space-y-2">
                          <p className="text-gray-900 dark:text-white flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">
                              Duration:
                            </span>
                            <span className="font-medium">
                              {new Date(leave.startDate).toLocaleDateString()} -{" "}
                              {new Date(leave.endDate).toLocaleDateString()}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Contact Information
                        </h4>
                        <div className="space-y-2">
                          <p className="text-gray-900 dark:text-white flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">
                              Student:
                            </span>
                            <span className="font-medium">
                              {leave.contactNumber}
                            </span>
                          </p>
                          <p className="text-gray-900 dark:text-white flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">
                              Parent:
                            </span>
                            <span className="font-medium">
                              {leave.parentContact}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Right Column */}
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
                          Reason for Leave
                        </h4>
                        <p className="text-gray-900 dark:text-white">
                          {leave.reason}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end items-center gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => {
                        const remarks = prompt("Enter remarks for rejection:");
                        if (remarks !== null) {
                          handleAction(leave._id, "reject", remarks);
                        }
                      }}
                      className="px-6 py-2.5 text-sm font-medium rounded-xl text-white bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => {
                        const remarks = prompt("Enter remarks for approval:");
                        if (remarks !== null) {
                          handleAction(leave._id, "approve", remarks);
                        }
                      }}
                      className="px-6 py-2.5 text-sm font-medium rounded-xl text-white bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200"
                    >
                      Approve
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default PendingLeaves;
