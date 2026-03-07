import { API_BASE_URL } from "@/app/config/api";

const AUTH_KEYS = {
  accessToken: "token",
  refreshToken: "refreshToken",
  user: "user",
} as const;

function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(AUTH_KEYS.accessToken);
}

function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(AUTH_KEYS.refreshToken);
}

export function setAuthStorage(accessToken: string, refreshToken: string, user: unknown): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_KEYS.accessToken, accessToken);
  localStorage.setItem(AUTH_KEYS.refreshToken, refreshToken);
  localStorage.setItem(AUTH_KEYS.user, JSON.stringify(user));
}

export function clearAuthStorage(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_KEYS.accessToken);
  localStorage.removeItem(AUTH_KEYS.refreshToken);
  localStorage.removeItem(AUTH_KEYS.user);
}

export interface RefreshResult {
  accessToken: string;
  refreshToken: string;
  user: unknown;
}

export async function refreshAuth(): Promise<RefreshResult | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;
  const res = await fetch(`${API_BASE_URL}/api/auth/refreshtoken`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });
  if (!res.ok) return null;
  const data = (await res.json()) as { accessToken?: string; refreshToken?: string; user?: unknown };
  const accessToken = data.accessToken ?? (data as unknown as { token?: string }).token;
  const newRefresh = data.refreshToken;
  if (!accessToken || !newRefresh) return null;
  const existingUser = typeof window !== "undefined" ? localStorage.getItem(AUTH_KEYS.user) : null;
  const user = data.user ?? (existingUser ? JSON.parse(existingUser) : {});
  setAuthStorage(accessToken, newRefresh, user);
  return { accessToken, refreshToken: newRefresh, user };
}

export interface ApiOptions extends RequestInit {
  skipAuth?: boolean;
  skipRefresh?: boolean;
}

async function request<T>(url: string, options: ApiOptions = {}): Promise<T> {
  const { skipAuth, skipRefresh, ...init } = options;
  const fullUrl = url.startsWith("http") ? url : `${API_BASE_URL}${url}`;
  const token = getAccessToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string>),
  };
  if (!skipAuth && token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }
  let res = await fetch(fullUrl, { ...init, headers });
  if (res.status === 401 && !skipAuth && !skipRefresh && getRefreshToken()) {
    const refreshed = await refreshAuth();
    if (refreshed) {
      (headers as Record<string, string>)["Authorization"] = `Bearer ${refreshed.accessToken}`;
      res = await fetch(fullUrl, { ...init, headers });
    }
  }
  if (!res.ok) {
    const errBody = await res.text();
    let message = "Request failed";
    try {
      const j = JSON.parse(errBody) as { message?: string };
      message = j.message ?? message;
    } catch {
      message = errBody || message;
    }
    throw new Error(message);
  }
  const text = await res.text();
  if (!text) return undefined as T;
  try {
    return JSON.parse(text) as T;
  } catch {
    return undefined as T;
  }
}

export const api = {
  get: <T>(url: string, options?: ApiOptions) => request<T>(url, { ...options, method: "GET" }),
  post: <T>(url: string, body?: unknown, options?: ApiOptions) =>
    request<T>(url, { ...options, method: "POST", body: body ? JSON.stringify(body) : undefined }),
  put: <T>(url: string, body?: unknown, options?: ApiOptions) =>
    request<T>(url, { ...options, method: "PUT", body: body ? JSON.stringify(body) : undefined }),
  delete: <T>(url: string, body?: unknown, options?: ApiOptions) =>
    request<T>(url, {
      ...options,
      method: "DELETE",
      body: body ? JSON.stringify(body) : undefined,
    }),
};

/** Register device push token for FCM (call after login when token is available). */
export async function registerPushToken(token: string, platform: "android" | "ios" | "web" = "web") {
  return api.post("/api/users/me/push-token", { token, platform });
}

/** Unregister push token (e.g. on logout). */
export async function unregisterPushToken(token: string) {
  return api.delete("/api/users/me/push-token", { token });
}

/** Mark announcements as read for the current user (updates unread badge). */
export async function markAnnouncementsAsRead(announcementIds: number[]) {
  if (announcementIds.length === 0) return;
  return api.post("/api/users/me/announcements/read", { announcementIds });
}

export { getAccessToken, getRefreshToken };
