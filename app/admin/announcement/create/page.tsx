"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/app/lib/api";
import { toast } from "react-hot-toast";
import {
  AnnouncementTargetAudience,
  type AnnouncementTargetAudienceType,
} from "@/app/types/announcement";

const TARGET_AUDIENCE_OPTIONS: { value: AnnouncementTargetAudienceType; label: string }[] = [
  { value: AnnouncementTargetAudience.ALL, label: "All" },
  { value: AnnouncementTargetAudience.STUDENTS, label: "Students only" },
  { value: AnnouncementTargetAudience.STAFF, label: "Staff only" },
  { value: AnnouncementTargetAudience.PARENTS, label: "Parents only" },
  { value: AnnouncementTargetAudience.STUDENTS_STAFF, label: "Students and staff" },
  { value: AnnouncementTargetAudience.STUDENTS_PARENTS, label: "Students and parents" },
  { value: AnnouncementTargetAudience.STAFF_PARENTS, label: "Staff and parents" },
];

interface HostelOption {
  id: number;
  name: string;
  studentCount?: number;
}

export default function CreateAnnouncement() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [targetAudience, setTargetAudience] = useState<AnnouncementTargetAudienceType>(
    AnnouncementTargetAudience.ALL
  );
  const [hostels, setHostels] = useState<HostelOption[]>([]);
  const [hostelIds, setHostelIds] = useState<number[]>([]);

  useEffect(() => {
    api
      .get<{ data: HostelOption[] }>("/api/admin/hostels?pageSize=100&pageNumber=1")
      .then((res) => setHostels(res?.data ?? []))
      .catch(() => setHostels([]));
  }, []);

  const onHostelToggle = (id: number) => {
    setHostelIds((prev) =>
      prev.includes(id) ? prev.filter((h) => h !== id) : [...prev, id]
    );
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error("Title and content are required");
      return;
    }
    setIsSubmitting(true);
    try {
      await api.post("/api/admin/announcements", {
        title: title.trim(),
        content: content.trim(),
        targetAudience,
        ...(hostelIds.length > 0 && { hostelIds }),
      });
      toast.success("Announcement created successfully");
      router.push("/admin/announcement/view");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create announcement"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-300 text-transparent bg-clip-text">
                NIVAS
              </h1>
              <span className="text-sm text-gray-500 dark:text-gray-400">|</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Create Announcement
              </span>
            </div>
            <button
              onClick={() => router.back()}
              className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              Back
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Create New Announcement
          </h2>

          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter announcement title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Content
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows={4}
                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter announcement content"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Target audience
              </label>
              <select
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value as AnnouncementTargetAudienceType)}
                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {TARGET_AUDIENCE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {hostels.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Limit to hostels (optional)
                </label>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Leave unchecked for org-wide. Select one or more to send only to those hostels.
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {hostels.map((h) => (
                    <label
                      key={h.id}
                      className="inline-flex items-center gap-2 rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      <input
                        type="checkbox"
                        checked={hostelIds.includes(h.id)}
                        onChange={() => onHostelToggle(h.id)}
                        className="rounded border-gray-300 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-900 dark:text-white">
                        {h.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Creating..." : "Create Announcement"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
