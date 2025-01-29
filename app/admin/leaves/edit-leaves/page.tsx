"use client";

import { API_BASE_URL } from "@/app/config/api";
import React, { useEffect, useState, useCallback } from "react";
import { getToken } from "@/app/utils/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
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

const EditLeaves = () => {
  const [leave, setLeave] = useState<Leave | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const searchParams = useSearchParams();
  const leaveId = searchParams.get("id");

  const router = useRouter();

  const fetchLeave = useCallback(async () => {
    if (!leaveId) {
      setError("No leave ID provided");
      return;
    }
    try {
      setLoading(true);
      const token = getToken();
      const response = await fetch(`${API_BASE_URL}/api/admin/getstudentleaveid/${leaveId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch leave details");

      const data: Leave = await response.json();
      setLeave(data);
      setError(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error fetching leave data");
    } finally {
      setLoading(false);
    }
  }, [leaveId]);

  const handleAction = async (action: "approve" | "reject") => {
    if (!leaveId) return;

    const remarks = prompt(`Enter remarks for ${action}:`);
    if (remarks === null) return;

    try {
      setProcessing(true);
      const token = getToken();
      const response = await fetch(`${API_BASE_URL}/api/staff/leaves/${leaveId}/review`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action, remarks }),
      });

      if (!response.ok) throw new Error("Failed to update leave status");

      alert(`Leave ${action}ed successfully`);
      fetchLeave();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Error processing action");
    } finally {
      setProcessing(false);
    }
  };
  
  useEffect(() => {
    if (leaveId) fetchLeave();
  }, [leaveId, fetchLeave]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      {/* Navigation */}
      <nav className="bg-gray-800 p-4 rounded-lg mb-6 flex justify-between items-center">
        <h1 className="text-xl font-semibold">Pending Leave Applications</h1>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 text-sm font-medium bg-gray-700 hover:bg-gray-600 rounded-lg"
        >
          Back
        </button>
      </nav>

      {loading ? (
        <p className="text-center text-gray-400">Loading pending applications...</p>
      ) : error ? (
        <p className="text-center text-red-400">{error}</p>
      ) : leave ? (
        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">{leave.studentId.firstName} {leave.studentId.lastName}</h2>
              <p className="text-gray-400">{leave.studentId.email}</p>
              <p className="text-gray-400">Applied on: {new Date(leave.createdAt).toLocaleDateString()}</p>
            </div>
            <span className="bg-yellow-600 text-sm px-4 py-2 rounded-lg">{leave.leaveType} Leave</span>
          </div>

          {/* Leave Details */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-gray-700 p-4 rounded-lg">
              <h4 className="text-gray-300">Duration</h4>
              <p className="text-lg">{new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <h4 className="text-gray-300">Address During Leave</h4>
              <p>{leave.address}</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <h4 className="text-gray-300">Contact Information</h4>
              <p>Student: {leave.contactNumber}</p>
              <p>Parent: {leave.parentContact}</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <h4 className="text-gray-300">Reason for Leave</h4>
              <p>{leave.reason}</p>
            </div>
          </div>

          {/* Review Status */}
          <div className="mt-6">
            <h4 className="text-lg font-semibold">Review Status</h4>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="bg-gray-700 p-4 rounded-lg flex justify-between">
                <span>Parent Review</span>
                <span className={`px-3 py-1 rounded-lg text-sm ${leave.parentReview?.status === "pending" ? "bg-yellow-600" : "bg-green-600"}`}>
                  {leave.parentReview?.status || "Pending"}
                </span>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg flex justify-between">
                <span>Staff Review</span>
                <span className={`px-3 py-1 rounded-lg text-sm ${leave.staffReview?.status === "pending" ? "bg-yellow-600" : "bg-green-600"}`}>
                  {leave.staffReview?.status || "Pending"}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex justify-end gap-4">
            <button onClick={() => handleAction("reject")} className="bg-red-600 px-6 py-3 rounded-lg">Reject</button>
            <button onClick={() => handleAction("approve")} className="bg-green-600 px-6 py-3 rounded-lg">Approve</button>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-400">No pending leave found.</p>
      )}
    </div>
  );
};

export default EditLeaves;
