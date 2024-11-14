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
      const response = await fetch(`${API_BASE_URL}/api/leaves/all`, {
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
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  if (loading) {
    return (
      <div className="py-8 text-center">
        <div className="mx-auto w-12 h-12 rounded-full border-b-2 border-blue-500 animate-spin"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        <p>Error: {error}</p>
        <button
          onClick={fetchLeaves}
          className="px-4 py-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="py-8 min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            All Leave Applications
          </h1>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            ← Back
          </button>
        </div>

        {leaves.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              No leave applications found
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {leaves.map((leave) => (
              <div
                key={leave._id}
                className="overflow-hidden bg-white rounded-lg shadow dark:bg-gray-800"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {leave.studentId?.firstName || "Unknown"}{" "}
                        {leave.studentId?.lastName || "Student"}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {leave.studentId?.email || "No email provided"}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Applied on:{" "}
                        {new Date(leave.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          leave.status || "pending"
                        )}`}
                      >
                        {(leave.status || "pending").charAt(0).toUpperCase() +
                          (leave.status || "pending").slice(1)}
                      </span>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                        {(leave.leaveType || "Unknown")
                          .charAt(0)
                          .toUpperCase() +
                          (leave.leaveType || "Unknown").slice(1)}{" "}
                        Leave
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Duration:</span>{" "}
                        {new Date(leave.startDate).toLocaleDateString()} to{" "}
                        {new Date(leave.endDate).toLocaleDateString()}
                      </p>
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Student Contact:</span>{" "}
                        {leave.contactNumber || "Not provided"}
                      </p>
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Parent Contact:</span>{" "}
                        {leave.parentContact || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium">
                          Address during leave:
                        </span>{" "}
                        {leave.address || "Not provided"}
                      </p>
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Reason:</span>{" "}
                        {leave.reason || "No reason provided"}
                      </p>
                    </div>
                  </div>

                  {(leave.staffRemarks || leave.reviewedBy) && (
                    <div className="p-3 mt-4 bg-gray-50 rounded dark:bg-gray-700">
                      {leave.staffRemarks && (
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          <span className="font-medium">Staff Remarks:</span>{" "}
                          {leave.staffRemarks}
                        </p>
                      )}
                      {leave.reviewedBy && (
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                          <span className="font-medium">Reviewed by:</span>{" "}
                          {leave.reviewedBy.firstName}{" "}
                          {leave.reviewedBy.lastName} on{" "}
                          {new Date(
                            leave.reviewedAt || ""
                          ).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllLeaves;
