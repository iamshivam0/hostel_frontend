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
      const response = await fetch(`${API_BASE_URL}/api/leaves/pending`, {
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
        `${API_BASE_URL}/api/leaves/${leaveId}/review`,
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
            Pending Leave Applications
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
              No pending leave applications
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
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      {(leave.leaveType || "Unknown").charAt(0).toUpperCase() +
                        (leave.leaveType || "Unknown").slice(1)}{" "}
                      Leave
                    </span>
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

                  <div className="flex gap-4 justify-end mt-6">
                    <button
                      onClick={() => {
                        const remarks = prompt("Enter remarks for rejection:");
                        if (remarks !== null) {
                          handleAction(leave._id, "reject", remarks);
                        }
                      }}
                      className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
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
                      className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                    >
                      Approve
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingLeaves;
