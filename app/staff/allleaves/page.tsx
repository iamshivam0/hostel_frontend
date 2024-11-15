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

const AllLeaves = () => {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchLeaves = async () => {
    try {
      const token = getToken();
      const response = await fetch(`${API_BASE_URL}/api/staff/leaves`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch leaves");
      }

      const data = await response.json();
      console.log(data.studentId);
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

  useEffect(() => {
    fetchLeaves();
  }, []);

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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Navigation */}
      <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              All Leave Applications
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
              Loading leave applications...
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
            <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
              <svg
                className="w-8 h-8 text-gray-400"
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
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
              No leaves found
            </h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              There are no leave applications to display.
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
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span
                        className={`px-4 py-1.5 rounded-full text-sm font-medium ${getStatusColor(
                          leave.status || "pending"
                        )}`}
                      >
                        {(leave.status || "pending").charAt(0).toUpperCase() +
                          (leave.status || "pending").slice(1)}
                      </span>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                        Applied on:{" "}
                        {new Date(leave.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
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
                              Type:
                            </span>
                            <span className="font-medium">
                              {leave.leaveType.charAt(0).toUpperCase() +
                                leave.leaveType.slice(1)}
                            </span>
                          </p>
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

                  {/* Review Section */}
                  {(leave.staffRemarks || leave.reviewedBy) && (
                    <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-4">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                            <svg
                              className="w-4 h-4 text-blue-600 dark:text-blue-400"
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
                        </div>
                        <div className="flex-1">
                          {leave.staffRemarks && (
                            <p className="text-blue-900 dark:text-blue-100 mb-2">
                              {leave.staffRemarks}
                            </p>
                          )}
                          {leave.reviewedBy && (
                            <p className="text-sm text-blue-700 dark:text-blue-300">
                              Reviewed by {leave.reviewedBy.firstName}{" "}
                              {leave.reviewedBy.lastName} on{" "}
                              {new Date(
                                leave.reviewedAt || ""
                              ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                          )}
                        </div>
                      </div>
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
};

export default AllLeaves;
