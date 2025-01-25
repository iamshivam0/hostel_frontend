"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser, logout, hasRole } from "@/app/utils/auth";
import { useTheme } from "@/app/providers/theme-provider";
import { User } from "@/app/types/user";

export default function AdminDashboard() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [user, setUser] = useState<User | null>(getUser() as User | null);
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!user || !hasRole(["admin"])) {
      router.push("/login");
    }
  }, [user, router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setFile(selectedFile || null);
    setMessage(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile?.type === "text/csv") {
      setFile(droppedFile);
    } else {
      setMessage({ text: "Only CSV files are allowed", type: "error" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setMessage({ text: "Please select a CSV file first.", type: "error" });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage({ text: "Please login to upload files.", type: "error" });
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/import-csv`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage({
          text: `File uploaded successfully! Processed ${data.rowCount} rows. and  ${data.insertedCount} inserted and ${data.updatedCount} updated`,
          type: "success",
        });
        setFile(null);
      } else {
        setMessage({ text: `Error: ${data.message}`, type: "error" });
      }
    } catch (error: any) {
      setMessage({ text: `Upload failed: ${error.message}`, type: "error" });
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Navigation Bar */}
      <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-300 text-transparent bg-clip-text">
                HMS
              </h1>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                |
              </span>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Admin Portal
              </span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                {theme === "dark" ? "🌞" : "🌙"}
              </button>
              <button
                onClick={logout}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 rounded-xl transition-all duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-2xl p-8 text-white shadow-lg">
            <h2 className="text-3xl font-bold mb-2">Import Data 📊</h2>
            <p className="text-blue-100">
              Upload CSV files to bulk import or update student and staff data.
            </p>
          </div>
        </div>

        {/* Upload Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                CSV File Upload
              </h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Bulk Import Tool
              </span>
            </div>

            <form onSubmit={handleSubmit}>
              <div
                className={`border-2 border-dashed rounded-xl p-8 mb-6 text-center transition-all duration-200 ${
                  isDragging
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer block space-y-4"
                >
                  <div className="text-gray-600 dark:text-gray-300">
                    <div className="mx-auto h-16 w-16 mb-4 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                      <svg
                        className="h-8 w-8 text-blue-600 dark:text-blue-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                    </div>
                    <p className="text-lg font-medium">
                      {file
                        ? file.name
                        : "Drag and drop your CSV file here, or click to browse"}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      Supported format: CSV
                    </p>
                  </div>
                </label>
              </div>

              {file && (
                <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 rounded-xl px-4 py-3 mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <svg
                        className="h-5 w-5 text-blue-600 dark:text-blue-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      {file.name}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    className="text-sm font-medium text-red-500 hover:text-red-600 dark:hover:text-red-400"
                  >
                    Remove
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={!file}
                className={`w-full py-3 px-6 rounded-xl font-medium text-white transition-all duration-200 ${
                  file
                    ? "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 cursor-pointer"
                    : "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                }`}
              >
                {file ? "Upload CSV" : "Select a file to upload"}
              </button>

              {message && (
                <div
                  className={`mt-4 p-4 rounded-xl text-sm font-medium ${
                    message.type === "success"
                      ? "bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-200"
                      : "bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-200"
                  }`}
                >
                  {message.text}
                </div>
              )}
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
