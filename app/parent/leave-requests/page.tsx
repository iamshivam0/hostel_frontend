"use client";
import { API_BASE_URL } from "@/app/config/api";
import React, { useEffect, useState } from "react";
import { getToken, hasRole } from "@/app/utils/auth";
import { useRouter } from "next/navigation";

interface Review {
  status: "pending" | "approved" | "rejected";
  remarks?: string;
  reviewedBy?: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  reviewedAt?: Date;
}

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
  parentReview?: Review;
  staffReview?: Review;
  createdAt: string;
  studentId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

const ParentLeaveRequests = () => {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is parent
    if (!hasRole(["parent"])) {
      router.push("/login");
      return;
    }
    fetchLeaves();
  }, [router]);

  const fetchLeaves = async () => {
    try {
      const token = getToken();
      const response = await fetch(`${API_BASE_URL}/api/parent/child-leaves`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch leaves");
      }

      const data = await response.json();
      setLeaves(data);
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
        `${API_BASE_URL}/api/parent/leaves/${leaveId}/review`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ action, remarks }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Failed to ${action} leave`);
      }

      alert(data.message || `Leave ${action}ed successfully`);
      fetchLeaves();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : `Failed to ${action} leave`;
      console.error(`Error ${action}ing leave:`, errorMessage);
      alert(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              Leave Requests
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
              Loading leave requests...
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
              No Leave Requests
            </h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              There are no leave requests to review at this time.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {leaves.map((leave) => (
              <div
                key={leave._id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <div className="p-6">
                  {/* Student Info */}
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
                            {leave.studentId?.firstName}{" "}
                            {leave.studentId?.lastName}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Applied on:{" "}
                            {new Date(leave.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    <span className="px-4 py-2 rounded-xl text-sm font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800">
                      {leave.leaveType
                        ? `${leave.leaveType
                            .charAt(0)
                            .toUpperCase()}${leave.leaveType.slice(1)} Leave`
                        : "Leave Request"}
                    </span>
                  </div>

                  {/* Leave Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Duration
                        </h4>
                        <p className="text-gray-900 dark:text-white">
                          {new Date(leave.startDate).toLocaleDateString()} -{" "}
                          {new Date(leave.endDate).toLocaleDateString()}
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

                    <div className="space-y-4">
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Contact Details
                        </h4>
                        <div className="space-y-2">
                          <p className="text-gray-900 dark:text-white flex justify-between">
                            <span>Student:</span>
                            <span>{leave.contactNumber}</span>
                          </p>
                          <p className="text-gray-900 dark:text-white flex justify-between">
                            <span>Parent:</span>
                            <span>{leave.parentContact}</span>
                          </p>
                        </div>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Address During Leave
                        </h4>
                        <p className="text-gray-900 dark:text-white">
                          {leave.address}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Review Status */}
                  <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                      Review Status
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 dark:text-gray-400">
                            Parent Review
                          </span>
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-lg ${
                              leave.parentReview?.status === "approved"
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                : leave.parentReview?.status === "rejected"
                                ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                            }`}
                          >
                            {leave.parentReview?.status || "Pending"}
                          </span>
                        </div>
                        {leave.parentReview?.remarks && (
                          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Remarks: {leave.parentReview.remarks}
                          </p>
                        )}
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 dark:text-gray-400">
                            Staff Review
                          </span>
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-lg ${
                              leave.staffReview?.status === "approved"
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                : leave.staffReview?.status === "rejected"
                                ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                            }`}
                          >
                            {leave.staffReview?.status || "Pending"}
                          </span>
                        </div>
                        {leave.staffReview?.remarks && (
                          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Remarks: {leave.staffReview.remarks}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons - Only show if parent hasn't reviewed yet */}
                  {!leave.parentReview?.status && (
                    <div className="flex justify-end gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                      <button
                        onClick={() => {
                          const remarks = prompt(
                            "Enter remarks for rejection:"
                          );
                          if (remarks !== null) {
                            handleAction(leave._id, "reject", remarks);
                          }
                        }}
                        className="px-6 py-2.5 text-sm font-medium rounded-xl text-white bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 transition-all duration-200"
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
                        className="px-6 py-2.5 text-sm font-medium rounded-xl text-white bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 transition-all duration-200"
                      >
                        Approve
                      </button>
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

export default ParentLeaveRequests;
