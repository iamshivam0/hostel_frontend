"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

interface AuthGuardProps {
  children: React.ReactNode;
}

// Define strict route access by role
const roleAccess = {
  student: {
    allowed: ["/student/dashboard"],
    redirect: "/student/dashboard",
  },
  staff: {
    allowed: ["/staff/dashboard"],
    redirect: "/staff/dashboard",
  },
  admin: {
    allowed: ["/admin/dashboard", "/student/dashboard", "/staff/dashboard"], // Admin can access all routes
    redirect: "/admin/dashboard",
  },
  parent: {
    allowed: ["/parent/dashboard"],
    redirect: "/parent/dashboard",
  },
};

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    checkAuth();
  }, [pathname]);

  const checkAuth = () => {
    const userStr = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    // If no user or token, redirect to login
    if (!userStr || !token) {
      setAuthorized(false);
      router.push("/login");
      return;
    }

    try {
      const user = JSON.parse(userStr);
      const userRole = user.role as keyof typeof roleAccess;

      // Check if role exists in our access configuration
      if (!roleAccess[userRole]) {
        setAuthorized(false);
        router.push("/login");
        return;
      }

      // Check if current path is allowed for user's role
      const isRouteAllowed = roleAccess[userRole].allowed.some((route) =>
        pathname.startsWith(route)
      );

      if (!isRouteAllowed) {
        setAuthorized(false);
        // Redirect to the default route for their role
        router.push(roleAccess[userRole].redirect);
        return;
      }

      setAuthorized(true);
    } catch (error) {
      console.error("Auth check failed:", error);
      setAuthorized(false);
      router.push("/login");
    }
  };

  // Add a loading state or spinner here if needed
  if (!authorized) {
    return null;
  }

  return <>{children}</>;
}
