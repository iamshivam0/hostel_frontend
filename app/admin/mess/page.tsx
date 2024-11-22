"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const MessPage = () => {
  const [menuImage, setMenuImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    console.log("Fetching current menu...");
    fetchCurrentMenu();
  }, []);

  const fetchCurrentMenu = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/mess-menu`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      // console.log("API Response Status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error Response Data:", errorData);
        throw new Error(errorData.message || "Failed to fetch menu");
      }

      const data = await response.json();
      // console.log("Fetched Data:", data);

      if (data.url) {
        // console.log("Menu Image URL from API:", data.url);
        setMenuImage(data.url);
      } else {
        console.warn("No menu image URL found in API response");
      }
    } catch (error) {
      console.error("Error fetching menu image:", error);
      setError(
        error instanceof Error ? error.message : "Failed to fetch menu image"
      );
      alert("Failed to fetch menu image");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      console.warn("No file selected for upload");
      return;
    }

    if (!file.type.includes("image")) {
      // console.error("Invalid file type:", file.type);
      setError("Please upload an image file");
      alert("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      // console.error("File size too large:", file.size);
      setError("Image size should be less than 5MB");
      alert("Image size should be less than 5MB");
      return;
    }

    setIsUploading(true);
    setError(null);
    const formData = new FormData();
    formData.append("messPhoto", file);
    formData.append("description", "Mess Menu");

    try {
      // console.log("Uploading file...");
      const response = await fetch(
        `${API_BASE_URL}/api/admin/upload-mess-menu`,
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // console.log("Upload Response Status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error Response Data from Upload:", errorData);
        throw new Error(errorData.message || "Upload failed");
      }

      const data = await response.json();
      // console.log("Upload Response Data:", data);

      if (data.messPhoto.url) {
        console.log("New Menu Image URL:", data.messPhoto.url);
        setMenuImage(data.messPhoto.url);
        alert("Menu uploaded successfully");
      } else {
        console.error("Invalid response format from upload");
        throw new Error("Invalid response format");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to upload menu image";
      console.error("Error uploading image:", errorMessage);
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
            >
              <svg
                className="w-6 h-6 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back
            </button>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-300 text-transparent bg-clip-text">
              Mess Management
            </h1>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-xl">
            {error}
          </div>
        )}

        <div className="mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-2xl p-8 text-white shadow-lg">
            <h2 className="text-3xl font-bold mb-2">Mess Menu Management 🍽️</h2>
            <p className="text-blue-100">
              Upload and manage the mess menu for students and staff.
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Current Menu
            </h3>
            <div className="flex items-center gap-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUploading}
                className="text-sm text-gray-600 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900/30 dark:file:text-blue-400"
              />
              <button
                disabled={isUploading}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
              >
                {isUploading ? "Uploading..." : "Upload New Menu"}
              </button>
            </div>
          </div>

          <div className="mt-8">
            {menuImage ? (
              <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                <Image
                  src={menuImage}
                  alt="Mess Menu"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            ) : (
              <div className="w-full aspect-[4/3] flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                      <svg
                        className="w-8 h-8 text-blue-600 dark:text-blue-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    No menu image uploaded yet. Please upload a menu.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MessPage;
