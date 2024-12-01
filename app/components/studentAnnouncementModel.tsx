import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/app/config/api";

interface StudentAnnouncement {
  _id: string;
  title: string;
  content: string;
  studentName: string;
  createdAt: string;
}

interface GeneralAnnouncement {
  _id: string;
  title: string;
  content: string;
  staffName: string;
  targetAudience: "students" | "staff" | "all";
  createdAt: string;
}

interface AnnouncementResponse {
  studentAnnouncements: StudentAnnouncement[];
  generalAnnouncements: GeneralAnnouncement[];
  metadata: {
    totalStudentAnnouncements: number;
    totalGeneralAnnouncements: number;
    lastUpdated: Date;
  };
}

interface AnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AnnouncementType = "student" | "general" | "all";

const StudentAnnouncementModal = ({
  isOpen,
  onClose,
}: AnnouncementModalProps) => {
  const [studentAnnouncements, setStudentAnnouncements] = useState<
    StudentAnnouncement[]
  >([]);
  const [generalAnnouncements, setGeneralAnnouncements] = useState<
    GeneralAnnouncement[]
  >([]);
  const [selectedType, setSelectedType] = useState<AnnouncementType>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchAnnouncements();
    }
  }, [isOpen]);

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/student/getAnnouncments`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch announcements");
      }

      const data: AnnouncementResponse = await response.json();
      setStudentAnnouncements(data.studentAnnouncements);
      setGeneralAnnouncements(data.generalAnnouncements);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to fetch announcements"
      );
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredAnnouncements = () => {
    switch (selectedType) {
      case "student":
        return studentAnnouncements.map((ann) => ({
          ...ann,
          isStudent: true,
        }));
      case "general":
        return generalAnnouncements.map((ann) => ({
          ...ann,
          isStudent: false,
        }));
      case "all":
        return [
          ...studentAnnouncements.map((ann) => ({
            ...ann,
            isStudent: true,
          })),
          ...generalAnnouncements.map((ann) => ({
            ...ann,
            isStudent: false,
          })),
        ].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl bg-white dark:bg-gray-800/95 rounded-2xl shadow-2xl border border-gray-200/20 dark:border-gray-700/30">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700/50">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Announcements
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              View all announcements
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-xl transition-colors duration-200"
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

        {/* Filter Tabs */}
        <div className="flex space-x-2 p-4 border-b border-gray-200 dark:border-gray-700/50">
          {(["all", "student", "general"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 
                ${
                  selectedType === type
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-48 space-y-4">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Loading announcements...
              </p>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-48">
              <div className="text-center space-y-2">
                <svg
                  className="w-10 h-10 text-red-500 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-red-500 dark:text-red-400">{error}</p>
              </div>
            </div>
          ) : getFilteredAnnouncements().length === 0 ? (
            <div className="flex items-center justify-center h-48">
              <div className="text-center space-y-2">
                <svg
                  className="w-10 h-10 text-gray-400 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
                <p className="text-gray-500 dark:text-gray-400">
                  No announcements available
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {getFilteredAnnouncements().map((announcement) => (
                <div
                  key={announcement._id}
                  className="p-6 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-gray-200/50 dark:border-gray-600/20 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {announcement.title}
                        </h4>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            announcement.isStudent
                              ? "bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-300"
                              : "bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-300"
                          }`}
                        >
                          {announcement.isStudent ? "Student" : "General"}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mb-3 whitespace-pre-wrap">
                        {announcement.content}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 mt-4 pt-4 border-t border-gray-200/50 dark:border-gray-600/20">
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <span>
                        {announcement.isStudent
                          ? (announcement as StudentAnnouncement).studentName
                          : (announcement as GeneralAnnouncement).staffName}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>
                        {new Date(announcement.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentAnnouncementModal;
