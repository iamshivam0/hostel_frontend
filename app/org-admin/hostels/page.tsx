"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "@/app/providers/theme-provider";
import { useAuth } from "@/app/contexts/AuthContext";
import { api } from "@/app/lib/api";
import Pagination from "@/app/components/Pagination";

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

export default function OrgAdminHostelsPage() {
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();
  const [data, setData] = useState<HostelsResponse | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: "",
    code: "",
    address: "",
    city: "",
  });
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState("");

  const fetchHostels = useCallback(async (page = 1) => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get<HostelsResponse>(
        `/api/admin/hostels?pageSize=${DEFAULT_PAGE_SIZE}&pageNumber=${page}`
      );
      setData(
        res ?? {
          data: [],
          total: 0,
          pageNumber: 1,
          pageSize: DEFAULT_PAGE_SIZE,
          totalPages: 0,
        }
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load hostels");
      setData({
        data: [],
        total: 0,
        pageNumber: 1,
        pageSize: DEFAULT_PAGE_SIZE,
        totalPages: 0,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setPageNumber(page);
  }, []);

  useEffect(() => {
    fetchHostels(pageNumber);
  }, [fetchHostels, pageNumber]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError("");
    if (!createForm.name.trim() || !createForm.code.trim()) {
      setCreateError("Name and code are required");
      return;
    }
    setCreateLoading(true);
    try {
      await api.post("/api/admin/hostels", {
        name: createForm.name.trim(),
        code: createForm.code.trim(),
        address: createForm.address.trim() || undefined,
        city: createForm.city.trim() || undefined,
      });
      setCreateForm({ name: "", code: "", address: "", city: "" });
      setCreateOpen(false);
      await fetchHostels(1);
    } catch (e) {
      setCreateError(e instanceof Error ? e.message : "Failed to create hostel");
    } finally {
      setCreateLoading(false);
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
                Hostels
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
            Hostels
          </h1>
          <button
            onClick={() => setCreateOpen(true)}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl"
          >
            Create hostel
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
        ) : data && data.data.length === 0 ? (
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-8 text-center text-gray-600 dark:text-gray-400">
            No hostels yet. Create your first hostel.
          </div>
        ) : data ? (
          <>
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Students
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {data.data.map((h) => (
                    <tr key={h.id} className="bg-white dark:bg-gray-800">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                        {h.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                        {h.studentCount}
                      </td>
                      <td className="px-4 py-3 text-right text-sm">
                        <Link
                          href={`/org-admin/hostels/${h.id}`}
                          className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination
              page={data.pageNumber}
              totalPages={data.totalPages}
              total={data.total}
              pageSize={data.pageSize}
              onPageChange={handlePageChange}
            />
          </>
        ) : null}

        {createOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Create hostel
              </h2>
              {createError && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm">
                  {createError}
                </div>
              )}
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={createForm.name}
                    onChange={(e) =>
                      setCreateForm((f) => ({ ...f, name: e.target.value }))
                    }
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Hostel name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Code
                  </label>
                  <input
                    type="text"
                    required
                    value={createForm.code}
                    onChange={(e) =>
                      setCreateForm((f) => ({ ...f, code: e.target.value }))
                    }
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="e.g. H1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Address (optional)
                  </label>
                  <input
                    type="text"
                    value={createForm.address}
                    onChange={(e) =>
                      setCreateForm((f) => ({ ...f, address: e.target.value }))
                    }
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    City (optional)
                  </label>
                  <input
                    type="text"
                    value={createForm.city}
                    onChange={(e) =>
                      setCreateForm((f) => ({ ...f, city: e.target.value }))
                    }
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="City"
                  />
                </div>
                <div className="flex gap-2 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setCreateOpen(false);
                      setCreateError("");
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createLoading}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl disabled:opacity-50"
                  >
                    {createLoading ? "Creating..." : "Create"}
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
