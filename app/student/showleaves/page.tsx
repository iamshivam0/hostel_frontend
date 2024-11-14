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
  }, [user, router]);

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
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            My Leave Applications
          </h1>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            ← Back
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        ) : leaves.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400">
              No leave applications found
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {leaves.map((leave) => (
              <div
                key={leave._id}
                className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {leave.leaveType.charAt(0).toUpperCase() +
                          leave.leaveType.slice(1)}{" "}
                        Leave
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Applied on:{" "}
                        {new Date(leave.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        leave.status
                      )}`}
                    >
                      {leave.status.charAt(0).toUpperCase() +
                        leave.status.slice(1)}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Duration:</span>{" "}
                        {new Date(leave.startDate).toLocaleDateString()} to{" "}
                        {new Date(leave.endDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        <span className="font-medium">Contact:</span>{" "}
                        {leave.contactNumber}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        <span className="font-medium">
                          Parent&apos;s Contact:
                        </span>{" "}
                        {leave.parentContact}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Address:</span>{" "}
                        {leave.address}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        <span className="font-medium">Reason:</span>{" "}
                        {leave.reason}
                      </p>
                    </div>
                  </div>

                  {leave.staffRemarks && (
                    <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded">
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        <span className="font-medium">Staff Remarks:</span>{" "}
                        {leave.staffRemarks}
                      </p>
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
}
