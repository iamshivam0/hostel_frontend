/**
 * Web push: request permission, get FCM token, register with backend.
 * Call after login; unregister on logout.
 * When a push is received in foreground, dispatches "announcement-push-received" so the bell can refresh.
 */
import { getToken, onMessage } from "firebase/messaging";
import { getMessagingInstance } from "./firebase";
import { registerPushToken, unregisterPushToken } from "./api";

/** Custom event name: dispatch when a push notification is received (app in foreground). */
export const PUSH_RECEIVED_EVENT = "announcement-push-received";

let foregroundListenerSetup = false;

/**
 * Set up listener for foreground FCM messages. When user has the tab open and a push arrives,
 * we dispatch PUSH_RECEIVED_EVENT so the bell can refetch and update the count.
 * Call once when the app loads (e.g. from NotificationsBell mount). Idempotent.
 */
export function setupForegroundPushListener(): void {
  if (typeof window === "undefined" || foregroundListenerSetup) return;
  const messaging = getMessagingInstance();
  if (!messaging) return;
  foregroundListenerSetup = true;
  onMessage(messaging, () => {
    window.dispatchEvent(new CustomEvent(PUSH_RECEIVED_EVENT));
  });
}

const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
const WEB_PUSH_TOKEN_KEY = "web_push_token";

export function isWebPushSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    "Notification" in window &&
    "serviceWorker" in navigator
  );
}

/** Current browser notification permission (default | granted | denied). */
export function getNotificationPermission(): NotificationPermission | null {
  if (typeof window === "undefined" || !("Notification" in window)) return null;
  return Notification.permission;
}

export function getStoredPushToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(WEB_PUSH_TOKEN_KEY);
}

function storePushToken(token: string): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(WEB_PUSH_TOKEN_KEY, token);
}

function clearStoredPushToken(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(WEB_PUSH_TOKEN_KEY);
}

/**
 * Request notification permission, get FCM token, and register with backend.
 * Call when user is authenticated. No-op if Firebase/VAPID not configured or permission denied.
 */
export async function registerWebPush(): Promise<{ ok: boolean; reason?: string }> {
  if (!isWebPushSupported()) {
    return { ok: false, reason: "Push not supported in this browser" };
  }
  if (!VAPID_KEY) {
    return { ok: false, reason: "VAPID key not configured (NEXT_PUBLIC_FIREBASE_VAPID_KEY)" };
  }
  const messaging = getMessagingInstance();
  if (!messaging) {
    return { ok: false, reason: "Firebase not configured (check NEXT_PUBLIC_FIREBASE_* in .env)" };
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      return { ok: false, reason: "Notification permission denied" };
    }

    const token = await getToken(messaging, { vapidKey: VAPID_KEY });
    if (!token) {
      return { ok: false, reason: "Could not get FCM token (check firebase-messaging-sw.js config)" };
    }

    await registerPushToken(token, "web");
    storePushToken(token);
    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { ok: false, reason: message };
  }
}

/**
 * Unregister current device from backend (call on logout).
 */
export async function unregisterWebPush(): Promise<void> {
  const token = getStoredPushToken();
  if (!token) return;
  try {
    await unregisterPushToken(token);
  } catch {
    // ignore
  }
  clearStoredPushToken();
}
