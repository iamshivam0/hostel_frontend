"use client";

import { useState } from "react";
import Link from "next/link";
import { useTheme } from "@/app/providers/theme-provider";
import { useAuth } from "@/app/contexts/AuthContext";

export default function RegisterPage() {
  const { theme, toggleTheme } = useTheme();
  const { orgSignup } = useAuth();
  const [formData, setFormData] = useState({
    orgName: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await orgSignup({
      orgName: formData.orgName.trim(),
      email: formData.email.trim(),
      password: formData.password,
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
    });
    setLoading(false);
    if (!result.ok) {
      setError(result.error ?? "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black transition-colors duration-200 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl shadow-xl dark:shadow-gray-900/50 border border-gray-200 dark:border-gray-800 p-8 space-y-6 relative">
          <button
            onClick={toggleTheme}
            className="absolute top-6 right-6 p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? "🌞" : "🌙"}
          </button>

          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-300 text-transparent bg-clip-text">
              NIVAS
            </h1>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Create your organization
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Register as Org Admin — create your organization and first admin
              account.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400 p-4 rounded-xl text-sm flex items-center gap-2">
              <svg className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="orgName"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Organization name
                </label>
                <input
                  id="orgName"
                  name="orgName"
                  type="text"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                  placeholder="My Hostel Org"
                  value={formData.orgName}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    First name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Last name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                  placeholder="admin@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  minLength={6}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full px-4 py-3 text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 dark:from-blue-500 dark:to-blue-400 dark:hover:from-blue-600 dark:hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Creating account...
                </span>
              ) : (
                "Create organization"
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
