"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/app/lib/api";
import { toast } from "react-hot-toast";
import type { Announcement, AnnouncementListResponse } from "@/app/types/announcement";
import { TableComponent } from "@/components/ui/TableComponent";
import Pagination from "@/app/components/Pagination";

const DEFAULT_PAGE_SIZE = 10;

export default function ParentAnnouncementsPage() {
  const router = useRouter();
  const [response, setResponse] = useState<AnnouncementListResponse | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchAnnouncements = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        pageNumber: String(page),
        pageSize: String(DEFAULT_PAGE_SIZE),
      });
      const res = await api.get<AnnouncementListResponse>(
        `/api/parent/announcements?${params.toString()}`
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
  }, []);

  useEffect(() => {
    fetchAnnouncements(pageNumber);
  }, [fetchAnnouncements, pageNumber]);

  const handlePageChange = useCallback((page: number) => {
    setPageNumber(page);
  }, []);

  const authorName = (row: Announcement) => {
    const u = row.createdByUser;
    return u ? `${u.firstName} ${u.lastName}` : "—";
  };

  const dataWithAuthor = response?.data.map((a) => ({
    ...a,
    createdByDisplay: authorName(a),
  })) ?? null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Announcements
            </span>
            <div className="flex items-center gap-2">
              <Link
                href="/parent/dashboard"
                className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-xl"
              >
                Dashboard
              </Link>
              <button
                onClick={() => router.back()}
                className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-xl"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            Announcements
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            View announcements relevant to parents.
          </p>
        </div>

        <TableComponent<Announcement & { createdByDisplay?: string }>
          headings={["title", "targetAudience", "createdByDisplay", "createdAt"]}
          data={dataWithAuthor}
          idKey="id"
          options={{ hideIds: true, isRowClickable: false }}
          customColumnNames={{
            title: "Title",
            targetAudience: "Audience",
            createdByDisplay: "Created by",
            createdAt: "Created",
          }}
          renderCell={(heading, value) => {
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
          actions={[]}
          getActionListHandler={() => []}
          onAction={() => {}}
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
