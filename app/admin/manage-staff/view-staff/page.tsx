"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser, hasRole } from "@/app/utils/auth";
import { useTheme } from "@/app/providers/theme-provider";
import { API_BASE_URL } from "@/app/config/api";
import { toast } from "react-hot-toast";

interface Staff {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
}

export default function ViewStaff() {
  const router = useRouter();
  const { theme } = useTheme();
  const [staffMembers, setStaffMembers] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);

  useEffect(() => {
    const user = getUser();
    if (!user || !hasRole(["admin"])) {
      router.push("/login");
      return;
    }
    fetchStaffMembers();
  }, []);

  const fetchStaffMembers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/admin/getallstaffs`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch staff members");
      }

      const data = await response.json();
      setStaffMembers(data);
    } catch (error) {
      console.error("Error fetching staff members:", error);
      toast.error("Failed to fetch staff members");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStaff = async (staffId: string) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/admin/staff/${staffId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        toast.success("Staff member deleted successfully");
        fetchStaffMembers();
        setShowDeleteModal(false);
        setSelectedStaff(null);
      } else {
        toast.error(data.message || "Failed to delete staff member");
      }
    } catch (error) {
      console.error("Error deleting staff member:", error);
      toast.error("Failed to delete staff member");
    }
  };

  const filteredStaff = staffMembers.filter(
    (staff) =>
      staff.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.phoneNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                View Staff
              </span>
            </div>
            <button
              onClick={() => router.push("/admin/manage-staff")}
              className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              Back to Staff Management
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <div className="mb-6">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search staff by name, email, role, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              />
            </div>
            <button
              onClick={() => router.push("/admin/manage-staff/add-staff")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add New Staff
            </button>
          </div>
        </div>

        {/* Staff List */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Staff Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {loading ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-center">
                      <div className="flex justify-center items-center space-x-2">
                        <svg
                          className="animate-spin h-5 w-5 text-blue-500"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        <span>Loading staff members...</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredStaff.map((staff) => (
                    <tr
                      key={staff._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {staff.firstName} {staff.lastName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {staff.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {staff.phoneNumber && (
                          <span className="text-sm text-gray-900 dark:text-white">
                            {staff.phoneNumber}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={() =>
                              router.push(
                                `/admin/manage-staff/edit/${staff._id}`
                              )
                            }
                            className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400 text-sm font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              setSelectedStaff(staff);
                              setShowDeleteModal(true);
                            }}
                            className="text-red-600 hover:text-red-900 dark:hover:text-red-400 text-sm font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedStaff && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 max-w-[90%]">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Confirm Delete
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Are you sure you want to delete {selectedStaff.firstName}{" "}
              {selectedStaff.lastName}? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedStaff(null);
                }}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteStaff(selectedStaff._id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
