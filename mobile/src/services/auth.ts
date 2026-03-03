import { User } from '@/types';
import { API_BASE_URL } from '@/utils/constants';

type LoginResponse = {
  token: string;
  user: User;
  message?: string;
};

export async function loginWithCredentials(email: string, password: string): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, Password: password }),
  });

  const data = (await response.json()) as LoginResponse;

  if (!response.ok) {
    throw new Error(data.message ?? 'Login failed. Please verify your credentials.');
  }

  return data;
}
