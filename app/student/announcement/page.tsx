"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/app/lib/api";
import { toast } from "react-hot-toast";

export default function CreateStudentAnnouncement() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error("Title and content are required");
      return;
    }
    setIsSubmitting(true);
    try {
      await api.post("/api/student/create-announcement", {
        title: title.trim(),
        content: content.trim(),
      });
      toast.success("Announcement created successfully");
      router.push("/student/dashboard");
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
                Create Student Announcement
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
            Create Student Announcement
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
