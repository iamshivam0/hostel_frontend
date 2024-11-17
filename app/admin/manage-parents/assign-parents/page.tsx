"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser, hasRole } from "@/app/utils/auth";
import { useTheme } from "@/app/providers/theme-provider";
import { API_BASE_URL } from "@/app/config/api";
import { toast } from "react-hot-toast";

interface Student {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  parentId?:
    | string
    | {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
      };
  roomNumber: string;
}

interface Parent {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  children?: string[];
}

interface AssignmentSuccessModalProps {
  student: Student;
  parent: Parent;
  onClose: () => void;
}

function AssignmentSuccessModal({
  student,
  parent,
  onClose,
}: AssignmentSuccessModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 max-w-[90%]">
        <div className="text-center mb-4">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900">
            <svg
              className="h-6 w-6 text-green-600 dark:text-green-400"
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
            Assignment Successful!
          </h3>
        </div>

        <div className="mt-4 space-y-4">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Student Details
            </h4>
            <p className="mt-1 text-sm text-gray-900 dark:text-white">
              {student.firstName} {student.lastName}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {student.email}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Room {student.roomNumber}
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Assigned Parent
            </h4>
            <p className="mt-1 text-sm text-gray-900 dark:text-white">
              {parent.firstName} {parent.lastName}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {parent.email}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AssignParents() {
  const router = useRouter();
  const { theme } = useTheme();
  const [students, setStudents] = useState<Student[]>([]);
  const [parents, setParents] = useState<Parent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [selectedParent, setSelectedParent] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [assignedDetails, setAssignedDetails] = useState<{
    student: Student;
    parent: Parent;
  } | null>(null);
  const [isAssigning, setIsAssigning] = useState(false);

  useEffect(() => {
    const user = getUser();
    if (!user || !hasRole(["admin"])) {
      router.push("/login");
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [studentsRes, parentsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/admin/students`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }),
        fetch(`${API_BASE_URL}/api/admin/parents`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }),
      ]);

      if (!studentsRes.ok || !parentsRes.ok) {
        throw new Error("Failed to fetch data");
      }

      const studentsData = await studentsRes.json();
      const parentsData = await parentsRes.json();

      setStudents(studentsData);
      setParents(parentsData);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleAssignParent = async () => {
    try {
      setIsAssigning(true);
      const response = await fetch(`${API_BASE_URL}/api/admin/assign-parent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          studentId: selectedStudent,
          parentId: selectedParent,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const student = students.find((s) => s._id === selectedStudent);
        const parent = parents.find((p) => p._id === selectedParent);

        if (student && parent) {
          setAssignedDetails({ student, parent });
        }

        toast.success("Parent assigned successfully");
        await fetchData();
        setShowAssignModal(false);
        setSelectedStudent("");
        setSelectedParent("");
      } else {
        toast.error(data.message || "Failed to assign parent");
      }
    } catch (error) {
      console.error("Error assigning parent:", error);
      toast.error("Failed to assign parent. Please try again.");
    } finally {
      setIsAssigning(false);
    }
  };

  const handleRemoveParent = async (studentId: string) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/admin/remove-parent/${studentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        toast.success("Parent removed successfully");
        fetchData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error removing parent:", error);
      toast.error("Failed to remove parent");
    }
  };

  const filteredStudents = students.filter(
    (student) =>
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.roomNumber.toLowerCase().includes(searchTerm.toLowerCase())
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
                Assign Parents
              </span>
            </div>
            <button
              onClick={() => router.push("/admin/manage-parents")}
              className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              Back to Parent Management
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Section */}
        <div className="mb-6">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search students by name, email, or room number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              />
            </div>
            <button
              onClick={() => setShowAssignModal(true)}
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
              Assign Parent
            </button>
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Student Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Room Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Parent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredStudents.map((student) => (
                  <tr
                    key={student._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {student.firstName} {student.lastName}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {student.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-lg">
                        Room {student.roomNumber}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {student.parentId ? (
                        <div className="text-sm">
                          <div className="font-medium text-gray-900 dark:text-white">
                            {typeof student.parentId === "object" &&
                            student.parentId !== null ? (
                              <>
                                {(student.parentId as any).firstName}{" "}
                                {(student.parentId as any).lastName}
                              </>
                            ) : (
                              parents.find((p) => p._id === student.parentId)
                                ?.firstName +
                              " " +
                              parents.find((p) => p._id === student.parentId)
                                ?.lastName
                            )}
                          </div>
                          <div className="text-gray-500 dark:text-gray-400">
                            {typeof student.parentId === "object" &&
                            student.parentId !== null
                              ? (student.parentId as any).email
                              : parents.find((p) => p._id === student.parentId)
                                  ?.email}
                          </div>
                        </div>
                      ) : (
                        <span className="text-yellow-600 dark:text-yellow-400 text-sm">
                          No parent assigned
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {student.parentId ? (
                        <button
                          onClick={() => handleRemoveParent(student._id)}
                          className="text-red-600 hover:text-red-900 dark:hover:text-red-400 text-sm font-medium"
                        >
                          Remove Parent
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedStudent(student._id);
                            setShowAssignModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400 text-sm font-medium"
                        >
                          Assign Parent
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Assign Parent Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 max-w-[90%]">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Assign Parent to Student
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Select Student
                </label>
                <select
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="">Select a student...</option>
                  {students
                    .filter((s) => !s.parentId)
                    .map((student) => (
                      <option key={student._id} value={student._id}>
                        {student.firstName} {student.lastName} - Room{" "}
                        {student.roomNumber}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Select Parent
                </label>
                <select
                  value={selectedParent}
                  onChange={(e) => setSelectedParent(e.target.value)}
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="">Select a parent...</option>
                  {parents.map((parent) => (
                    <option key={parent._id} value={parent._id}>
                      {parent.firstName} {parent.lastName} - {parent.email}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => {
                    setShowAssignModal(false);
                    setSelectedStudent("");
                    setSelectedParent("");
                  }}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssignParent}
                  disabled={!selectedStudent || !selectedParent || isAssigning}
                  className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                    transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                    flex items-center justify-center gap-2`}
                >
                  {isAssigning ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-white"
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
                      Assigning...
                    </>
                  ) : (
                    "Assign Parent"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {assignedDetails && (
        <AssignmentSuccessModal
          student={assignedDetails.student}
          parent={assignedDetails.parent}
          onClose={() => setAssignedDetails(null)}
        />
      )}
    </div>
  );
}
