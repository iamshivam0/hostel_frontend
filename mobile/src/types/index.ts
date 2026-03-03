export type UserRole = 'student' | 'staff' | 'admin' | 'parent';

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

export type FeatureItem = {
  title: string;
  description: string;
  route: string;
};

export type Announcement = {
  id: string;
  title: string;
  description: string;
  createdAt?: string;
};
