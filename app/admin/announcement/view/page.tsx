'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/app/config/api';
import { toast } from 'react-hot-toast';

interface Announcement {
  _id: string;
  title: string;
  content: string;
  type: 'student' | 'general';
  studentName?: string;
  staffName?: string;
  targetAudience?: 'students' | 'staff' | 'all';
  createdAt: string;
}

export default function ViewAnnouncements() {
  const router = useRouter();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'student' | 'general'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/getadminannouncment`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch announcements');
      }

      const data = await response.json();
      const allAnnouncements = [
        ...data.studentAnnouncements.map((a: Announcement) => ({ ...a, type: 'student' as const })),
        ...data.generalAnnouncements.map((a: Announcement) => ({ ...a, type: 'general' as const }))
      ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      setAnnouncements(allAnnouncements);
    } catch (error) {
      toast.error('Failed to fetch announcements');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAnnouncements = announcements
    .filter(announcement => {
      if (filter === 'all') return true;
      return announcement.type === filter;
    })
    .filter(announcement =>
      announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const deleteAnnouncement = async (id: string, type: string) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/delete-announcment/${type}/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete announcement');
      }

      toast.success('Announcement deleted successfully');
      fetchAnnouncements();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete announcement');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-300 text-transparent bg-clip-text">
                HMS
              </h1>
              <span className="text-sm text-gray-500 dark:text-gray-400">|</span>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Announcements</span>
            </div>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-all duration-200"
            >
              ← Back
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-2xl p-8 text-white shadow-lg">
            <h2 className="text-3xl font-bold mb-2">Announcements 📢</h2>
            <p className="text-blue-100">View and manage all hostel announcements in one place.</p>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="mb-6 space-y-4">
  {/* Filters and Search Bar */}
  <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Filter Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            filter === 'all'
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('student')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            filter === 'student'
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          }`}
        >
          Student
        </button>
        <button
          onClick={() => setFilter('general')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            filter === 'general'
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          }`}
        >
          General
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative flex-1">
        <input
          type="text"
          placeholder="Search announcements..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200"
        />
        <svg
          className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 dark:text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
    </div>
  </div>

  {/* Create New Button */}
  <div className="flex justify-end">
    <button
      onClick={() => router.push('/admin/announcement/create')}
      className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-medium rounded-xl shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2"
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4v16m8-8H4"
        />
      </svg>
      Create New
    </button>
  </div>
</div>

        {/* Announcements List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredAnnouncements.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <svg
              className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No announcements found</h3>
            <p className="text-gray-500 dark:text-gray-400">Create a new announcement to get started.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredAnnouncements.map((announcement) => (
              <div
                key={announcement._id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-6 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {announcement.title}
                    </h3>
                    <div className="mt-2 flex flex-wrap gap-2 text-sm">
                      <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                        {announcement.type === 'student' ? announcement.studentName : announcement.staffName}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                        {new Date(announcement.createdAt).toLocaleDateString()}
                      </span>
                      {announcement.targetAudience && (
                        <span className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                          For: {announcement.targetAudience}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => deleteAnnouncement(announcement._id, announcement.type)}
                    className="p-2 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
                <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                  {announcement.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}