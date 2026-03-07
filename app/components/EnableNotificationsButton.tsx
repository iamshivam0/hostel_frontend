"use client";

import { useState } from "react";
import {
  registerWebPush,
  isWebPushSupported,
  getNotificationPermission,
} from "@/app/lib/pushNotifications";
import { toast } from "react-hot-toast";

/**
 * Button to enable push notifications. Must be triggered by user click so the browser
 * shows the permission prompt (browsers block prompts that aren't from a user gesture).
 */
export default function EnableNotificationsButton() {
  const [loading, setLoading] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const permission = getNotificationPermission();

  if (!isWebPushSupported() || permission === "granted" || enabled) return null;

  const handleClick = async () => {
    if (permission === "denied") {
      toast.error("Notifications blocked. Enable them in your browser settings for this site.");
      return;
    }
    setLoading(true);
    try {
      const result = await registerWebPush();
      if (result.ok) {
        toast.success("Push notifications enabled");
        setEnabled(true);
      } else {
        toast.error(result.reason ?? "Could not enable notifications");
      }
    } catch {
      toast.error("Could not enable notifications");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="px-3 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline disabled:opacity-50"
      aria-label="Enable push notifications"
    >
      {loading ? "Enabling…" : "Enable notifications"}
    </button>
  );
}
