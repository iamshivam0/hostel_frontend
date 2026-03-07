export interface User {
  _id?: string;
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  roleId?: number;
  organizationId?: string;
  hostelId?: string;
  roomNumber?: string;
  profileImage?: string;
  createdAt?: string;
  updatedAt?: string;
}

/** User id for API (backend may send id or _id). */
export function getUserId(user: User): string {
  return (user.id ?? user._id) ?? "";
}
