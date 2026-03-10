"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/app/lib/api";
import { toast } from "react-hot-toast";
import type { Announcement, AnnouncementListResponse } from "@/app/types/announcement";
import { TableComponent, type TableAction } from "@/components/ui/TableComponent";
import Pagination from "@/app/components/Pagination";

const DEFAULT_PAGE_SIZE = 10;

export default function ViewAnnouncements() {
  const router = useRouter();
  const [response, setResponse] = useState<AnnouncementListResponse | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [targetAudienceFilter, setTargetAudienceFilter] = useState<string>("");

  const fetchAnnouncements = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          pageNumber: String(page),
          pageSize: String(DEFAULT_PAGE_SIZE),
        });
        if (targetAudienceFilter) params.set("targetAudience", targetAudienceFilter);
        const res = await api.get<AnnouncementListResponse>(
          `/api/admin/announcements?${params.toString()}`
        );
        setResponse(
          res ?? {
            data: [],
            total: 0,
            pageNumber: 1,
            pageSize: DEFAULT_PAGE_SIZE,
            totalPages: 0,
          }
        );
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed to fetch announcements");
        setResponse({
          data: [],
          total: 0,
          pageNumber: 1,
          pageSize: DEFAULT_PAGE_SIZE,
          totalPages: 0,
        });
      } finally {
        setLoading(false);
      }
    },
    [targetAudienceFilter]
  );

  useEffect(() => {
    fetchAnnouncements(pageNumber);
  }, [fetchAnnouncements, pageNumber]);

  const handlePageChange = useCallback((page: number) => {
    setPageNumber(page);
  }, []);

  const handleDelete = useCallback(
    async (actionId: string, row: Announcement & { createdByDisplay?: string }) => {
      if (actionId !== "delete") return;
      if (!window.confirm("Are you sure you want to delete this announcement?")) return;
      try {
        await api.delete(`/api/admin/announcements/${row.id}`);
        toast.success("Announcement deleted");
        fetchAnnouncements(pageNumber);
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed to delete");
      }
    },
    [pageNumber, fetchAnnouncements]
  );

  const handleEdit = useCallback(
    (actionId: string, row: Announcement & { createdByDisplay?: string }) => {
      if (actionId === "edit") router.push(`/admin/announcement/edit/${row.id}`);
    },
    [router]
  );

  const actions: TableAction[] = [
    { id: "edit", label: "Edit" },
    { id: "delete", label: "Delete" },
  ];

  const authorName = (row: Announcement) => {
    const u = row.createdByUser;
    return u ? `${u.firstName} ${u.lastName}` : "—";
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-300 text-transparent bg-clip-text">
                NIVAS
              </h1>
              <span className="text-sm text-gray-500 dark:text-gray-400">|</span>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Announcements
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => router.push("/admin/announcement/create")}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl"
              >
                Create New
              </button>
              <button
                onClick={() => router.back()}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white bg-gray-100 dark:bg-gray-800 rounded-xl"
              >
                ← Back
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-2xl p-8 text-white shadow-lg">
            <h2 className="text-3xl font-bold mb-2">Announcements</h2>
            <p className="text-blue-100">
              View and manage all hostel announcements in one place.
            </p>
          </div>
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Target audience:
          </span>
          <select
            value={targetAudienceFilter}
            onChange={(e) => {
              setTargetAudienceFilter(e.target.value);
              setPageNumber(1);
            }}
            className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-1.5 text-sm"
          >
            <option value="">All</option>
            <option value="all">All</option>
            <option value="students">Students only</option>
            <option value="staff">Staff only</option>
            <option value="parents">Parents only</option>
            <option value="students_staff">Students and staff</option>
            <option value="students_parents">Students and parents</option>
            <option value="staff_parents">Staff and parents</option>
          </select>
        </div>

        <TableComponent<Announcement & { createdByDisplay?: string }>
          headings={["title", "targetAudience", "createdByDisplay", "createdAt"]}
          data={
            response
              ? response.data.map((a) => ({
                  ...a,
                  createdByDisplay: authorName(a),
                }))
              : null
          }
          idKey="id"
          options={{ hideIds: true, isRowClickable: false }}
          customColumnNames={{
            title: "Title",
            targetAudience: "Audience",
            createdByDisplay: "Created by",
            createdAt: "Created",
          }}
          renderCell={(heading, value, row) => {
            if (heading === "createdAt")
              return new Date(String(value)).toLocaleDateString();
            if (heading === "title")
              return (
                <span className="font-medium text-gray-900 dark:text-white">
                  {String(value)}
                </span>
              );
            return null;
          }}
          actions={actions}
          getActionListHandler={() => ["edit", "delete"]}
          onAction={(actionId, row) => {
            if (actionId === "edit") handleEdit(actionId, row);
            else handleDelete(actionId, row);
          }}
          isLoading={loading}
          emptyMessage="No announcements found."
        />

        {response && response.totalPages > 1 && (
          <Pagination
            page={response.pageNumber}
            totalPages={response.totalPages}
            total={response.total}
            pageSize={response.pageSize}
            onPageChange={handlePageChange}
          />
        )}
      </main>
    </div>
  );
}
