'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { API_BASE_URL } from '@/app/config/api';

interface AnnouncementFormData {
  type: 'student' | 'general';
  title: string;
  content: string;
  targetAudience?: 'students' | 'staff' | 'all';
}

export default function CreateAnnouncement() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm<AnnouncementFormData>({
    defaultValues: {
      type: 'general',
      targetAudience: 'all'
    }
  });

  const announcementType = watch('type');

  const onSubmit = async (data: AnnouncementFormData) => {
    setIsSubmitting(true);
    try {
      const user = localStorage.getItem('user');
      const userData = user ? JSON.parse(user) : null;
      
      if (!userData) {
        throw new Error('User not found');
      }

      const name = `${userData.firstName} ${userData.lastName}`;

      // If type is student, remove targetAudience from payload
      const payload = data.type === 'student' 
        ? { 
            type: data.type,
            title: data.title,
            content: data.content,
            name 
          }
        : {
            type: data.type,
            title: data.title,
            content: data.content,
            name,
            targetAudience: data.targetAudience
          };

      const response = await fetch(`${API_BASE_URL}/api/admin/createadminannouncment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create announcement');
      }
      
      toast.success('Announcement created successfully');
      // router.push('/admin/announcement');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create announcement');
      console.error(error);
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
                HMS
              </h1>
              <span className="text-sm text-gray-500 dark:text-gray-400">|</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">Create Announcement</span>
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
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Create New Announcement</h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Announcement Type
              </label>
              <select
                {...register('type', { required: 'Type is required' })}
                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:bg-gray-700"
              >
                <option value="general">General Announcement</option>
                <option value="student">Student Announcement</option>
              </select>
              {errors.type && (
                <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Title
              </label>
              <input
                type="text"
                {...register('title', { required: 'Title is required' })}
                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:bg-gray-700"
                placeholder="Enter announcement title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Content
              </label>
              <textarea
                {...register('content', { required: 'Content is required' })}
                rows={4}
                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:bg-gray-700"
                placeholder="Enter announcement content"
              />
              {errors.content && (
                <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
              )}
            </div>

            {announcementType === 'general' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Target Audience
                </label>
                <select
                  {...register('targetAudience', { required: 'Target audience is required for general announcements' })}
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:bg-gray-700"
                >
                  <option value="all">All</option>
                  <option value="students">Students Only</option>
                  <option value="staff">Staff Only</option>
                </select>
                {errors.targetAudience && (
                  <p className="mt-1 text-sm text-red-600">{errors.targetAudience.message}</p>
                )}
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Creating...' : 'Create Announcement'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}