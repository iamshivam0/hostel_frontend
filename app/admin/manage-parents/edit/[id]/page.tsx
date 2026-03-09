"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { API_BASE_URL } from "@/app/config/api";
import { User } from "@/app/types/user";
import { getUser, hasRole } from "@/app/utils/auth";

export default function EditStudent() {
    const router = useRouter();
    const params = useParams();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [user, setUser] = useState<User | null>(getUser() as User | null);
    const ParentId = params?.id;
    const [formData, setFormData] = useState<{
        firstName: string;
        lastName: string;
        email: string;
        currentPassword: string;
        newPassword: string;
        confirmPassword: string;
    }>({
        firstName: "",
        lastName: "",
        email: "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    useEffect(() => {
        if (!ParentId) {
            setError("Invalid Parent ID");
            return;
        }

        const fetchstaffData = async () => {
            setLoading(true);
            setError("");
            try {
                const response = await fetch(`${API_BASE_URL}/api/admin/parent/${ParentId}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch Parent data");
                }

                const Parent = await response.json();
                // console.log("this is staff", staff);
                setFormData((prev) => ({
                    ...prev,
                    ...Parent.Parent,
                }));
            } catch (error) {
                setError(error instanceof Error ? error.message : "Something went wrong");
            } finally {
                setLoading(false);
            }
        };

        fetchstaffData();
    }, [ParentId]);
    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.newPassword !== formData.confirmPassword) {
            setError("New passwords don't match");
            return;
        }

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const response = await fetch(
                `${API_BASE_URL}/api/admin/updatepasswords/${ParentId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify({
                        // currentPassword: formData.currentPassword,
                        password: formData.newPassword,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to change password");
            }

            setSuccess("Password changed successfully!");
            setFormData((prev) => ({
                ...prev,
                newPassword: "",
                confirmPassword: "",
            }));
        } catch (error) {
            setError(
                error instanceof Error ? error.message : "Failed to change password"
            );
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
        setError("");
        setSuccess("");
    };
    const handleProfileInfoUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/parent/${ParentId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error("Failed to update Parent data");
            }

            setSuccess("parent details updated successfully!");
        } catch (error) {
            setError(error instanceof Error ? error.message : "Failed to update parent data");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            {/* Navigation Bar */}
            <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-300 text-transparent bg-clip-text">
                                NIVAS
                            </h1>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                |
                            </span>
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                Edit staff Details
                            </span>
                        </div>
                        <button
                            onClick={() => router.push("/admin/manage-parents/view-parents")}
                            className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                        >
                            Back to Parent Management
                        </button>
                    </div>
                </div>
            </nav>
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Success Message */}
                {success && (
                    <div className="mb-6 bg-green-50 dark:bg-green-900/30 text-green-500 dark:text-green-400 p-4 rounded-xl text-sm flex items-center gap-2">
                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                            />
                        </svg>
                        {success}
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mb-6 bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400 p-4 rounded-xl text-sm flex items-center gap-2">
                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                clipRule="evenodd"
                            />
                        </svg>
                        {error}
                    </div>
                )}

                <div className="space-y-6">
                    {/* Profile Information */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="p-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Profile Information
                            </h2>
                            <form className="space-y-6">

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            First Name
                                        </label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Last Name
                                        </label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                                        />
                                    </div>

                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        onClick={handleProfileInfoUpdate}
                                        disabled={loading}
                                        className="px-6 py-3 text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50"
                                    >
                                        Update Profile Information
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Change Password */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="p-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Change Password
                            </h2>
                            <form onSubmit={handlePasswordChange} className="space-y-4">
                                {/* <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Current Password
                                    </label>
                                    <input
                                        type="password"
                                        name="currentPassword"
                                        value={formData.currentPassword}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                                    />
                                </div> */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        name="newPassword"
                                        value={formData.newPassword}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Confirm New Password
                                    </label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-6 py-3 text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                                    >
                                        Change Password
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </main>

        </div>
    )
}

