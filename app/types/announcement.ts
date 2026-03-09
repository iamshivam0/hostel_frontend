/** Target audience enum values (match backend). */
export const AnnouncementTargetAudience = {
  ALL: "all",
  STUDENTS: "students",
  STAFF: "staff",
  PARENTS: "parents",
  STUDENTS_STAFF: "students_staff",
  STUDENTS_PARENTS: "students_parents",
  STAFF_PARENTS: "staff_parents",
} as const;

export type AnnouncementTargetAudienceType =
  (typeof AnnouncementTargetAudience)[keyof typeof AnnouncementTargetAudience];

export interface AnnouncementCreatedBy {
  id: string;
  firstName: string;
  lastName: string;
}

export interface Announcement {
  id: number;
  organizationId: string;
  createdByUserId: string | null;
  title: string;
  content: string;
  targetAudience: string;
  createdAt: string;
  updatedAt: string;
  createdByUser: AnnouncementCreatedBy | null;
}

export interface AnnouncementListResponse {
  data: Announcement[];
  total: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  /** Count of announcements not yet read by the current user (for bell badge). */
  unreadCount?: number;
}
