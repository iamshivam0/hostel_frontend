"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "@/app/providers/theme-provider";
import { useAuth } from "@/app/contexts/AuthContext";
import { api } from "@/app/lib/api";
import Pagination from "@/app/components/Pagination";
import { TableComponent } from "@/components/ui/TableComponent";

/** Staff users only – only staff can be assigned to hostels; org-admin already sees all hostels. */
interface StaffUser extends Record<string, unknown> {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role?: string;
  assignedHostels?: { id: number; name: string }[];
}

interface StaffResponse {
  data: StaffUser[];
  total: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

interface HostelItem {
  id: number;
  name: string;
  studentCount: number;
}

interface HostelsResponse {
  data: HostelItem[];
  total: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

const DEFAULT_PAGE_SIZE = 10;

export default function OrgAdminHostelAdminsPage() {
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();
  const [staffResponse, setStaffResponse] = useState<StaffResponse | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [assignModalUser, setAssignModalUser] = useState<StaffUser | null>(null);
  const [hostels, setHostels] = useState<HostelItem[]>([]);
  const [assignForm, setAssignForm] = useState({ hostelId: "" });
  const [assignLoading, setAssignLoading] = useState(false);
  const [assignError, setAssignError] = useState("");

  const fetchStaff = useCallback(async (page = 1) => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get<StaffResponse>(
        `/api/admin/getallstaffs?pageNumber=${page}&pageSize=${DEFAULT_PAGE_SIZE}&includeAssignedHostels=true`
      );
      if (res && "data" in res && Array.isArray((res as StaffResponse).data)) {
        setStaffResponse(res as StaffResponse);
      } else {
        setStaffResponse({
          data: [],
          total: 0,
          pageNumber: 1,
          pageSize: DEFAULT_PAGE_SIZE,
          totalPages: 0,
        });
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load staff");
      setStaffResponse(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchHostelsForModal = useCallback(async () => {
    try {
      const res = await api.get<HostelsResponse>(
        "/api/admin/hostels?pageNumber=1&pageSize=100"
      );
      const payload = res as HostelsResponse;
      setHostels(payload?.data ?? []);
    } catch {
      setHostels([]);
    }
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setPageNumber(page);
  }, []);

  useEffect(() => {
    fetchStaff(pageNumber);
  }, [fetchStaff, pageNumber]);

  const openAssignModal = (user: StaffUser) => {
    setAssignModalUser(user);
    setAssignForm({ hostelId: "" });
    setAssignError("");
    fetchHostelsForModal();
  };

  const handleAssignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignModalUser || !assignForm.hostelId.trim()) {
      setAssignError("Select a hostel");
      return;
    }
    setAssignLoading(true);
    setAssignError("");
    try {
      await api.post(`/api/admin/hostels/${assignForm.hostelId}/users`, {
        userId: assignModalUser.id,
        role: "staff",
      });
      setAssignModalUser(null);
      setAssignForm({ hostelId: "" });
      await fetchStaff(pageNumber);
    } catch (e) {
      setAssignError(e instanceof Error ? e.message : "Failed to assign");
    } finally {
      setAssignLoading(false);
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
              <Link
                href="/org-admin/hostels"
                className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              >
                Hostels
              </Link>
              <span className="text-sm text-gray-500 dark:text-gray-400">|</span>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Hostel Admins
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
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            Hostel Admins
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Assign staff users to hostels. Org-admin can see all hostels by default; only staff need to be assigned.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-4 rounded-xl bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
          <TableComponent<StaffUser>
            headings={["firstName", "lastName", "email", "assignedHostels"]}
            data={loading ? null : (staffResponse?.data ?? [])}
            idKey="id"
            options={{ isRowClickable: false }}
            customColumnNames={{
              firstName: "First name",
              lastName: "Last name",
              email: "Email",
              assignedHostels: "Assigned hostels",
            }}
            actions={[{ id: "assign", label: "Assign" }]}
            getActionListHandler={(row) =>
              !row.assignedHostels?.length ? ["assign"] : []
            }
            onAction={(actionId, row) => {
              if (actionId === "assign") openAssignModal(row);
            }}
            isLoading={loading}
            emptyMessage="No staff found."
            renderCell={(heading, value, row) => {
              if (heading === "assignedHostels") {
                const hostels = row.assignedHostels;
                return (
                  <span className="text-gray-600 dark:text-gray-300">
                    {hostels?.length
                      ? hostels.map((h) => h.name).join(", ")
                      : "None"}
                  </span>
                );
              }
              if (heading === "firstName") {
                return (
                  <span className="font-medium text-gray-900 dark:text-white">
                    {row.firstName}
                  </span>
                );
              }
              if (heading === "email") {
                return (
                  <span className="text-gray-600 dark:text-gray-300">
                    {row.email}
                  </span>
                );
              }
              return null;
            }}
          />
        </div>

        {staffResponse && staffResponse.totalPages > 1 && !loading && (
          <div className="mt-4">
            <Pagination
              page={staffResponse.pageNumber}
              totalPages={staffResponse.totalPages}
              total={staffResponse.total}
              pageSize={staffResponse.pageSize}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </main>

      {assignModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Assign to hostel
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {assignModalUser.firstName} {assignModalUser.lastName} ({assignModalUser.email})
            </p>
            {assignError && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm">
                {assignError}
              </div>
            )}
            <form onSubmit={handleAssignSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Hostel
                </label>
                <select
                  required
                  value={assignForm.hostelId}
                  onChange={(e) =>
                    setAssignForm((f) => ({ ...f, hostelId: e.target.value }))
                  }
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Select hostel</option>
                  {hostels.map((h) => (
                    <option key={h.id} value={String(h.id)}>
                      {h.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setAssignModalUser(null);
                    setAssignForm({ hostelId: "" });
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
  );
}
