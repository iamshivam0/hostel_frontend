export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://hostel-backend-new.onrender.com";

// Use environment variables for sensitive data like encryption keys
export const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || "thisisthekey";

// Add a warning if sensitive environment variables are not defined
if (!process.env.ENCRYPTION_KEY) {
  console.warn(
    "Warning: ENCRYPTION_KEY is not set in environment variables. Using the default key for development."
  );
}
