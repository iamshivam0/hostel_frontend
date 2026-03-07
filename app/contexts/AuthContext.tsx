"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import type { User } from "@/app/types/user";
import { API_BASE_URL } from "@/app/config/api";
import {
  clearAuthStorage,
  setAuthStorage,
  getAccessToken,
  getRefreshToken,
} from "@/app/lib/api";
import { unregisterWebPush } from "@/app/lib/pushNotifications";

const WEB_ALLOWED_ROLES = ["admin", "staff"];

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
  orgSignup: (params: {
    orgName: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => Promise<{ ok: boolean; error?: string }>;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function loadUserFromStorage(): User | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("user");
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUserState] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setUserState(loadUserFromStorage());
    setIsLoading(false);
  }, []);

  // Don't auto-request notification permission (browser often won't show prompt without a user click).
  // Use the "Enable notifications" button in the nav instead.

  const setUser = useCallback((u: User | null) => {
    setUserState(u);
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();

        if (!res.ok) {
          return { ok: false, error: data.message || "Login failed" };
        }

        const role = (data.user?.role ?? "").toLowerCase();
        if (!WEB_ALLOWED_ROLES.includes(role)) {
          return {
            ok: false,
            error:
              "This account cannot log in here. Use the student/parent app.",
          };
        }

        const accessToken = data.accessToken ?? data.token;
        const refreshToken = data.refreshToken;
        if (!accessToken || !refreshToken) {
          return { ok: false, error: "Invalid login response" };
        }
        setAuthStorage(accessToken, refreshToken, data.user);
        setUserState(data.user as User);

        if (role === "staff") {
          router.push("/staff/dashboard");
        } else {
          router.push("/org-admin");
        }
        return { ok: true };
      } catch (e) {
        return {
          ok: false,
          error: e instanceof Error ? e.message : "Something went wrong",
        };
      }
    },
    [router]
  );

  const logout = useCallback(async () => {
    await unregisterWebPush();
    const refreshToken = getRefreshToken();
    try {
      if (refreshToken) {
        await fetch(`${API_BASE_URL}/api/auth/signout`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        });
      }
    } catch {
      // ignore
    }
    clearAuthStorage();
    setUserState(null);
    router.push("/login");
  }, [router]);

  const orgSignup = useCallback(
    async (params: {
      orgName: string;
      email: string;
      password: string;
      firstName: string;
      lastName: string;
    }) => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/org-signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(params),
        });
        const data = await res.json();

        if (!res.ok) {
          return { ok: false, error: data.message || "Signup failed" };
        }

        const accessToken = data.accessToken ?? data.token;
        const refreshToken = data.refreshToken;
        if (!accessToken || !refreshToken) {
          return { ok: false, error: "Invalid signup response" };
        }
        setAuthStorage(accessToken, refreshToken, data.user);
        setUserState(data.user as User);
        router.push("/org-admin");
        return { ok: true };
      } catch (e) {
        return {
          ok: false,
          error: e instanceof Error ? e.message : "Something went wrong",
        };
      }
    },
    [router]
  );

  const value: AuthContextValue = {
    user,
    isLoading,
    isAuthenticated: !!getAccessToken() && !!user,
    login,
    logout,
    orgSignup,
    setUser,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
