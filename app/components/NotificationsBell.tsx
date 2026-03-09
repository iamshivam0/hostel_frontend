"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { api, markAnnouncementsAsRead } from "@/app/lib/api";
import { setupForegroundPushListener, PUSH_RECEIVED_EVENT } from "@/app/lib/pushNotifications";
import type { Announcement, AnnouncementListResponse } from "@/app/types/announcement";
import styles from "./NotificationsBell.module.css";

export interface NotificationsBellProps {
  /** API path for announcements list (e.g. /api/admin/announcements). Used for count and dropdown list. */
  announcementsApiPath: string;
  /** Route to full announcements page (View all). */
  viewAllHref: string;
  /** Optional route to create announcement (e.g. for admin). */
  createHref?: string;
  className?: string;
  "aria-label"?: string;
}

const PAGE_SIZE = 10;

/**
 * Bell icon that shows unread announcement count and a dropdown list.
 * Badge shows only new/unread count; opening the dropdown marks those as read.
 */
export default function NotificationsBell({
  announcementsApiPath,
  viewAllHref,
  createHref,
  className = "",
  "aria-label": ariaLabel = "Notifications",
}: NotificationsBellProps) {
  const [open, setOpen] = useState(false);
  const [response, setResponse] = useState<AnnouncementListResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasMarkedAsReadForOpenRef = useRef(false);

  const fetchAnnouncements = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        pageNumber: "1",
        pageSize: String(PAGE_SIZE),
      });
      const res = await api.get<AnnouncementListResponse>(
        `${announcementsApiPath}?${params.toString()}`
      );
      setResponse(res ?? { data: [], total: 0, pageNumber: 1, pageSize: PAGE_SIZE, totalPages: 0 });
    } catch {
      setResponse({ data: [], total: 0, pageNumber: 1, pageSize: PAGE_SIZE, totalPages: 0 });
    } finally {
      setLoading(false);
    }
  }, [announcementsApiPath]);

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  // When a push is received (foreground) or user returns to tab, refresh count
  useEffect(() => {
    setupForegroundPushListener();
    const onPush = () => fetchAnnouncements();
    window.addEventListener(PUSH_RECEIVED_EVENT, onPush);
    const onVisible = () => {
      if (document.visibilityState === "visible") fetchAnnouncements();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.removeEventListener(PUSH_RECEIVED_EVENT, onPush);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [fetchAnnouncements]);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // When dropdown opens, mark visible announcements as read once so badge shows only new items next time
  useEffect(() => {
    if (!open) {
      hasMarkedAsReadForOpenRef.current = false;
      return;
    }
    if (!response?.data?.length || hasMarkedAsReadForOpenRef.current) return;
    hasMarkedAsReadForOpenRef.current = true;
    const ids = response.data.map((a) => a.id);
    markAnnouncementsAsRead(ids).then(() => fetchAnnouncements()).catch(() => {});
  }, [open, response?.data]);

  const total = response?.total ?? 0;
  const unreadCount = response?.unreadCount ?? response?.total ?? 0;
  const list = response?.data ?? [];

  return (
    <div className={`${styles.container} ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={styles.bellButton}
        aria-label={ariaLabel}
        aria-expanded={open}
      >
        <svg
          className={styles.bellIcon}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <span className={styles.badge} aria-label={`${unreadCount} unread announcements`}>
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className={styles.dropdown} role="menu">
          <div className={styles.dropdownHeader}>
            <span className={styles.dropdownTitle}>Announcements</span>
            {total > 0 && (
              <span className={styles.dropdownCount}>
                {unreadCount > 0 ? `${unreadCount} new` : `${total} total`}
              </span>
            )}
          </div>
          {loading ? (
            <div className={styles.loading}>Loading…</div>
          ) : list.length === 0 ? (
            <div className={styles.empty}>No announcements</div>
          ) : (
            <ul className={styles.list}>
              {list.map((a) => (
                <li key={a.id} className={styles.listItem}>
                  <Link
                    href={viewAllHref}
                    className={styles.listLink}
                    onClick={() => setOpen(false)}
                  >
                    <span className={styles.listTitle}>{a.title}</span>
                    <span className={styles.listDate}>
                      {new Date(a.createdAt).toLocaleDateString()}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <div className={styles.dropdownFooter}>
            <Link
              href={viewAllHref}
              className={styles.viewAllLink}
              onClick={() => setOpen(false)}
            >
              View all
            </Link>
            {createHref && (
              <Link
                href={createHref}
                className={styles.createLink}
                onClick={() => setOpen(false)}
              >
                Create announcement
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
