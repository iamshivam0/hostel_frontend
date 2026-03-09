"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/app/lib/api";
import type { Announcement, AnnouncementListResponse } from "@/app/types/announcement";

interface AnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function StudentAnnouncementModal({
  isOpen,
  onClose,
}: AnnouncementModalProps) {
  const [response, setResponse] = useState<AnnouncementListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnnouncements = useCallback(async () => {
    try {
      const res = await api.get<AnnouncementListResponse>(
        "/api/student/announcements?pageNumber=1&pageSize=50"
      );
      setResponse(res ?? { data: [], total: 0, pageNumber: 1, pageSize: 50, totalPages: 0 });
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch announcements");
      setResponse({ data: [], total: 0, pageNumber: 1, pageSize: 50, totalPages: 0 });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetchAnnouncements();
    }
  }, [isOpen, fetchAnnouncements]);

  if (!isOpen) return null;

  const authorName = (a: Announcement) => {
    const u = a.createdByUser;
    return u ? `${u.firstName} ${u.lastName}` : "—";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl bg-white dark:bg-gray-800/95 rounded-2xl shadow-2xl border border-gray-200/20 dark:border-gray-700/30">
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700/50">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Announcements
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Announcements for your hostel
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-xl transition-colors duration-200"
            aria-label="Close"
          >
            <svg
              className="w-6 h-6 text-gray-500 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-48 space-y-4">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Loading announcements...
              </p>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-48">
              <div className="text-center space-y-2">
                <p className="text-red-500 dark:text-red-400">{error}</p>
              </div>
            </div>
          ) : !response?.data?.length ? (
            <div className="flex items-center justify-center h-48">
              <div className="text-center space-y-2">
                <p className="text-gray-500 dark:text-gray-400">
                  No announcements available
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {response.data.map((announcement) => (
                <div
                  key={announcement.id}
                  className="p-6 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-gray-200/50 dark:border-gray-600/20 hover:shadow-md transition-shadow duration-200"
                >
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {announcement.title}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 mb-3 whitespace-pre-wrap">
                    {announcement.content}
                  </p>
                  <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200/50 dark:border-gray-600/20">
                    <span>{authorName(announcement)}</span>
                    <span>
                      {new Date(announcement.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
