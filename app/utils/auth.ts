interface User {
  id: string;
  email: string;
  role: "admin" | "staff" | "student";
  firstName: string;
  lastName: string;
}

export const getUser = (): User | null => {
  if (typeof window === "undefined") return null;

  const userStr = localStorage.getItem("user");
  if (!userStr) return null;

  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};

export const logout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  window.location.href = "/login";
};

export const isAuthenticated = (): boolean => {
  return !!getToken() && !!getUser();
};

export const hasRole = (allowedRoles: string[]): boolean => {
  const user = getUser();
  return user ? allowedRoles.includes(user.role) : false;
};

export const checkRouteAccess = (pathname: string): boolean => {
  const user = getUser();
  if (!user) return false;

  const roleAccess = {
    student: ["/student/dashboard"],
    staff: ["/staff/dashboard"],
    admin: ["/admin/dashboard", "/student/dashboard", "/staff/dashboard"],
  };

  const allowedRoutes = roleAccess[user.role as keyof typeof roleAccess] || [];
  return allowedRoutes.some((route) => pathname.startsWith(route));
};
