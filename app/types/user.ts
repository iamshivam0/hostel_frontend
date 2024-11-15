export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "admin" | "student" | "staff" | "parent";
  roomNumber?: string;
}
