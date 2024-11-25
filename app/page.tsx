"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "./providers/theme-provider";
import { useEffect } from "react";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
// import { app } from '../firebase_app';

import { initializeApp } from 'firebase/app';


const firebaseConfig = {
  apiKey: "AIzaSyCaN_a5mqyexlHmf6emRuwR-C2PgNSlWcg",
  authDomain: "first-project-b7e96.firebaseapp.com",
  projectId: "first-project-b7e96",
  storageBucket: "first-project-b7e96.firebasestorage.app",
  messagingSenderId: "842145969374",
  appId: "1:842145969374:web:780d33c996f32893d03e4f",
  measurementId: "G-K0WR5RC353"
};


export default function Home() {
  const app = initializeApp(firebaseConfig)

  const messaging = getMessaging(app);
  const { theme, toggleTheme } = useTheme();

  onMessage(messaging, (payload) => {
    console.log('Message received. ', payload);
    // ...
  });

  function requestPermission() {
    console.log('Requesting permission...');
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        console.log('Notification permission granted.');

        generateToken();
      }
    })
  }

  const generateToken = () => {
    getToken(messaging, { vapidKey: 'BK9xzw4Kk1oYel64N1WjpJRE5KxcnfMz2Y2sRQu0dytm0GueGRe2W2u-P5-zFfMaC-3lSi4Zm-yQpGz1JR3rqkI' }).then((currentToken) => {
      if (currentToken) {
        // Send the token to your server and update the UI if necessary
        // ...
        saveTokenInDB(currentToken);
      } else {
        // Show permission request UI
        console.log('No registration token available. Request permission to generate one.');
        // ...
      }
    }).catch((err) => {
      console.log('An error occurred while retrieving token. ', err);
      // ...
    });
  }

  const saveTokenInDB = (token: string) => {
    // db save
    console.log(token)
  }

  useEffect(() => {
    requestPermission();
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Navigation Bar */}
      <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-300 text-transparent bg-clip-text">
                HMS
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={toggleTheme} className="p-2 rounded-lg ">
                {theme === "dark" ? "🌞" : "🌙"}
              </button>
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-transparent dark:from-blue-950/30 dark:to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 relative">
          <div className="text-center space-y-8">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-tight">
              <span className="block text-gray-900 dark:text-white mb-4">
                Welcome to
              </span>
              <span className="block bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-300 text-transparent bg-clip-text leading-normal pb-2">
                Hostel Management System
              </span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Streamline your hostel operations with our comprehensive
              management system. Manage rooms, students, and staff all in one
              place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Link
                href="/login"
                className="px-8 py-4 text-lg font-medium rounded-xl bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-all duration-200 shadow-lg hover:shadow-blue-500/25"
              >
                Get Started
              </Link>
              <Link
                href="/about"
                className="px-8 py-4 text-lg font-medium rounded-xl text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 shadow-lg border border-gray-200 dark:border-gray-700"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Section */}
      <div className="py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="group hover:scale-105 transition-all duration-200 p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-xl dark:shadow-gray-900/50 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-400 text-white mx-auto shadow-lg shadow-blue-500/30">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900 dark:text-white text-center">
                Room Management
              </h3>
              <p className="mt-4 text-gray-600 dark:text-gray-300 text-center leading-relaxed">
                Efficiently manage room allocations and maintenance schedules
                with our intuitive interface.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group hover:scale-105 transition-all duration-200 p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-xl dark:shadow-gray-900/50 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-400 text-white mx-auto shadow-lg shadow-blue-500/30">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900 dark:text-white text-center">
                Student Management
              </h3>
              <p className="mt-4 text-gray-600 dark:text-gray-300 text-center leading-relaxed">
                Keep track of student records, payments, and attendance with our
                user-friendly platform.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group hover:scale-105 transition-all duration-200 p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-xl dark:shadow-gray-900/50 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-400 text-white mx-auto shadow-lg shadow-blue-500/30">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900 dark:text-white text-center">
                Staff Management
              </h3>
              <p className="mt-4 text-gray-600 dark:text-gray-300 text-center leading-relaxed">
                Manage staff schedules, roles, and responsibilities with our
                efficient system.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 bg-gradient-to-b from-transparent to-gray-50 dark:to-gray-900">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-600 dark:text-gray-400">
            © 2024 Hostel Management System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
