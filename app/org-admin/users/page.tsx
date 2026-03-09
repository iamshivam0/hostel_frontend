"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "@/app/providers/theme-provider";
import { useAuth } from "@/app/contexts/AuthContext";
import { api } from "@/app/lib/api";

interface AssignableUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role?: string;
}

export default function OrgAdminUsersPage() {
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();
  const [users, setUsers] = useState<AssignableUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AssignableUser | null>(null);
  const [addForm, setAddForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get<AssignableUser[]>("/api/admin/users");
      setUsers(Array.isArray(res) ? res : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    if (!addForm.email.trim() || !addForm.password.trim() || !addForm.firstName.trim() || !addForm.lastName.trim()) {
      setSubmitError("All fields are required");
      return;
    }
    setSubmitLoading(true);
    try {
      await api.post("/api/admin/staff-create", {
        email: addForm.email.trim(),
        password: addForm.password,
        firstName: addForm.firstName.trim(),
        lastName: addForm.lastName.trim(),
      });
      setAddForm({ firstName: "", lastName: "", email: "", password: "" });
      setAddOpen(false);
      await fetchUsers();
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : "Failed to add user");
    } finally {
      setSubmitLoading(false);
    }
  };

  const openEdit = (user: AssignableUser) => {
    setEditingUser(user);
    setEditForm({
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      email: user.email ?? "",
    });
    setSubmitError("");
    setEditOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setSubmitError("");
    setSubmitLoading(true);
    try {
      await api.put(`/api/admin/staff/edit/${editingUser.id}`, {
        firstName: editForm.firstName.trim(),
        lastName: editForm.lastName.trim(),
        email: editForm.email.trim(),
      });
      setEditOpen(false);
      setEditingUser(null);
      await fetchUsers();
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : "Failed to update user");
    } finally {
      setSubmitLoading(false);
    }
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
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Users
              </span>
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            Users
          </h1>
          <button
            onClick={() => {
              setAddOpen(true);
              setSubmitError("");
              setAddForm({ firstName: "", lastName: "", email: "", password: "" });
            }}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl"
          >
            Add user
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 rounded-xl bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
          </div>
        ) : users.length === 0 ? (
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-8 text-center text-gray-600 dark:text-gray-400">
            No users yet. Add a user to get started.
          </div>
        ) : (
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {users.map((u) => (
                  <tr key={u.id} className="bg-white dark:bg-gray-800">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                      {u.firstName} {u.lastName}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                      {u.email}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                      {u.role ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-right text-sm">
                      <button
                        type="button"
                        onClick={() => openEdit(u)}
                        className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {addOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Add user
              </h2>
              {submitError && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm">
                  {submitError}
                </div>
              )}
              <form onSubmit={handleAddSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    First name
                  </label>
                  <input
                    type="text"
                    required
                    value={addForm.firstName}
                    onChange={(e) =>
                      setAddForm((f) => ({ ...f, firstName: e.target.value }))
                    }
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Last name
                  </label>
                  <input
                    type="text"
                    required
                    value={addForm.lastName}
                    onChange={(e) =>
                      setAddForm((f) => ({ ...f, lastName: e.target.value }))
                    }
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={addForm.email}
                    onChange={(e) =>
                      setAddForm((f) => ({ ...f, email: e.target.value }))
                    }
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={addForm.password}
                    onChange={(e) =>
                      setAddForm((f) => ({ ...f, password: e.target.value }))
                    }
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div className="flex gap-2 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setAddOpen(false);
                      setSubmitError("");
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitLoading}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl disabled:opacity-50"
                  >
                    {submitLoading ? "Adding..." : "Add"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {editOpen && editingUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Update user
              </h2>
              {submitError && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm">
                  {submitError}
                </div>
              )}
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    First name
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.firstName}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, firstName: e.target.value }))
                    }
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Last name
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.lastName}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, lastName: e.target.value }))
                    }
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={editForm.email}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, email: e.target.value }))
                    }
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div className="flex gap-2 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditOpen(false);
                      setEditingUser(null);
                      setSubmitError("");
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitLoading}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl disabled:opacity-50"
                  >
                    {submitLoading ? "Saving..." : "Save"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
