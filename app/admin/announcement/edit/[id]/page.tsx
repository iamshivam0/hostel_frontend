"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { api } from "@/app/lib/api";
import { toast } from "react-hot-toast";
import {
  AnnouncementTargetAudience,
  type Announcement,
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

export default function EditAnnouncementPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string | undefined;
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<{
    title: string;
    content: string;
    targetAudience: AnnouncementTargetAudienceType;
  }>({ title: "", content: "", targetAudience: AnnouncementTargetAudience.ALL });

  const fetchAnnouncement = useCallback(async () => {
    if (!id) return;
    try {
      const a = await api.get<Announcement>(`/api/admin/announcements/${id}`);
      if (a) {
        setForm({
          title: a.title,
          content: a.content,
          targetAudience: (a.targetAudience as AnnouncementTargetAudienceType) || AnnouncementTargetAudience.ALL,
        });
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load announcement");
      router.push("/admin/announcement/view");
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    fetchAnnouncement();
  }, [fetchAnnouncement]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setSubmitting(true);
    try {
      await api.put(`/api/admin/announcements/${id}`, {
        title: form.title,
        content: form.content,
        targetAudience: form.targetAudience,
      });
      toast.success("Announcement updated");
      router.push("/admin/announcement/view");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to update");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Edit Announcement
            </span>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              Back
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Edit Announcement
          </h2>

          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Title
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Content
              </label>
              <textarea
                value={form.content}
                onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                required
                rows={4}
                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Target audience
              </label>
              <select
                value={form.targetAudience}
                onChange={(e) =>
                  setForm((f) => ({ ...f, targetAudience: e.target.value as AnnouncementTargetAudienceType }))
                }
                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {TARGET_AUDIENCE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50"
              >
                {submitting ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
