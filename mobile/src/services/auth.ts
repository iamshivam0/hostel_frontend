import CryptoJS from 'crypto-js';
import { User } from '@/types';
import { API_BASE_URL, ENCRYPTION_KEY } from '@/utils/constants';

type LoginResponse = {
  token: string;
  user: User;
  message?: string;
};

export async function loginWithCredentials(email: string, password: string): Promise<LoginResponse> {
  const encryptedPassword = CryptoJS.AES.encrypt(password, ENCRYPTION_KEY).toString();

  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, Password: encryptedPassword }),
  });

  const data = (await response.json()) as LoginResponse;

  if (!response.ok) {
    throw new Error(data.message ?? 'Login failed. Please verify your credentials.');
  }

  return data;
}
