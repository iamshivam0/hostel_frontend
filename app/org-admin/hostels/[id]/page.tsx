"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTheme } from "@/app/providers/theme-provider";
import { useAuth } from "@/app/contexts/AuthContext";
import { api } from "@/app/lib/api";

interface HostelDetail {
  id: number;
  name: string;
  code?: string;
  organizationId?: string;
  address?: string;
  city?: string;
  isActive?: boolean;
  studentCount?: number;
}

interface AssignedUserItem {
  id: number;
  userId: string;
  role: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role?: string;
  };
}

interface AssignableUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role?: string;
}

export default function OrgAdminHostelDetailPage() {
  const params = useParams();
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();
  const id = typeof params.id === "string" ? params.id : "";
  const [hostel, setHostel] = useState<HostelDetail | null>(null);
  const [assignedUsers, setAssignedUsers] = useState<AssignedUserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [assignOpen, setAssignOpen] = useState(false);
  const [assignableUsers, setAssignableUsers] = useState<AssignableUser[]>([]);
  const [assignForm, setAssignForm] = useState({ userId: "", role: "staff" });
  const [assignLoading, setAssignLoading] = useState(false);
  const [assignError, setAssignError] = useState("");

  const fetchHostel = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError("");
    try {
      const res = await api.get<HostelDetail>(`/api/admin/hostels/${id}`);
      setHostel(res ?? null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load hostel");
      setHostel(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchAssignedUsers = useCallback(async () => {
    if (!id) return;
    try {
      const res = await api.get<AssignedUserItem[]>(`/api/admin/hostels/${id}/users`);
      setAssignedUsers(Array.isArray(res) ? res : []);
    } catch {
      setAssignedUsers([]);
    }
  }, [id]);

  const fetchAssignableUsers = useCallback(async () => {
    try {
      const res = await api.get<AssignableUser[]>("/api/admin/users");
      setAssignableUsers(Array.isArray(res) ? res : []);
    } catch {
      setAssignableUsers([]);
    }
  }, []);

  useEffect(() => {
    fetchHostel();
  }, [fetchHostel]);

  useEffect(() => {
    if (id) fetchAssignedUsers();
  }, [id, fetchAssignedUsers]);

  const handleAssignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignForm.userId.trim()) {
      setAssignError("Select a user");
      return;
    }
    setAssignLoading(true);
    setAssignError("");
    try {
      await api.post(`/api/admin/hostels/${id}/users`, {
        userId: assignForm.userId,
        role: assignForm.role,
      });
      setAssignOpen(false);
      setAssignForm({ userId: "", role: "staff" });
      await fetchAssignedUsers();
    } catch (e) {
      setAssignError(e instanceof Error ? e.message : "Failed to assign user");
    } finally {
      setAssignLoading(false);
    }
  };

  const handleUnassign = async (userId: string) => {
    if (!confirm("Remove this user from the hostel?")) return;
    try {
      await api.delete(`/api/admin/hostels/${id}/users/${userId}`);
      await fetchAssignedUsers();
    } catch {
      // ignore
    }
  };

  const openAssignModal = () => {
    setAssignError("");
    setAssignForm({ userId: "", role: "staff" });
    fetchAssignableUsers();
    setAssignOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <Link
                href="/org-admin"
                className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-300 text-transparent bg-clip-text"
              >
                NIVAS
              </Link>
              <span className="text-sm text-gray-500 dark:text-gray-400">|</span>
              <Link
                href="/org-admin/hostels"
                className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              >
                Hostels
              </Link>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? "🌞" : "🌙"}
              </button>
              <button
                onClick={() => void logout()}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 rounded-xl transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-4 p-4 rounded-xl bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
          </div>
        ) : hostel ? (
          <div className="space-y-6">
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {hostel.name}
              </h1>
              {hostel.code && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Code: {hostel.code}
                </p>
              )}
              {(hostel.address || hostel.city) && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {[hostel.address, hostel.city].filter(Boolean).join(", ")}
                </p>
              )}
              {"studentCount" in hostel && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Students: {hostel.studentCount ?? 0}
                </p>
              )}
            </div>

            <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                  Hostel Admins
                </h2>
                <button
                  type="button"
                  onClick={openAssignModal}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl"
                >
                  Assign
                </button>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Staff and admin users assigned to this hostel.
              </p>
              {assignedUsers.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  No users assigned yet. Click Assign to add.
                </p>
              ) : (
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {assignedUsers.map((a) => (
                    <li
                      key={a.id}
                      className="py-2 flex flex-wrap items-center justify-between gap-2"
                    >
                      <span className="text-sm text-gray-900 dark:text-white">
                        {a.user.firstName} {a.user.lastName} ({a.user.email}) — {a.role}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleUnassign(a.userId)}
                        className="text-sm text-red-600 hover:text-red-500 dark:text-red-400"
                      >
                        Unassign
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {assignOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full p-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Assign user to this hostel
                  </h2>
                  {assignError && (
                    <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm">
                      {assignError}
                    </div>
                  )}
                  <form onSubmit={handleAssignSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        User
                      </label>
                      <select
                        required
                        value={assignForm.userId}
                        onChange={(e) =>
                          setAssignForm((f) => ({ ...f, userId: e.target.value }))
                        }
                        className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="">Select user</option>
                        {assignableUsers.map((u) => (
                          <option key={u.id} value={u.id}>
                            {u.firstName} {u.lastName} ({u.email}) — {u.role ?? "—"}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Role for this hostel
                      </label>
                      <select
                        value={assignForm.role}
                        onChange={(e) =>
                          setAssignForm((f) => ({ ...f, role: e.target.value }))
                        }
                        className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="staff">Staff</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    <div className="flex gap-2 justify-end pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setAssignOpen(false);
                          setAssignError("");
                        }}
                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={assignLoading}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl disabled:opacity-50"
                      >
                        {assignLoading ? "Assigning..." : "Assign"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        ) : null}
      </main>
    </div>
  );
}
