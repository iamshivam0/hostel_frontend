import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/types';

const TOKEN_KEY = 'hms_token';
const USER_KEY = 'hms_user';
const THEME_KEY = 'hms_dark_mode';

export async function persistSession(token: string, user: User) {
  await AsyncStorage.multiSet([
    [TOKEN_KEY, token],
    [USER_KEY, JSON.stringify(user)],
  ]);
}

export async function clearSession() {
  await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
}

export async function readSession() {
  const [token, userRaw] = await AsyncStorage.multiGet([TOKEN_KEY, USER_KEY]);
  const sessionToken = token[1];
  const user = userRaw[1] ? (JSON.parse(userRaw[1]) as User) : null;

  if (!sessionToken || !user) {
    return null;
  }

  return { token: sessionToken, user };
}

export async function persistTheme(isDarkMode: boolean) {
  await AsyncStorage.setItem(THEME_KEY, String(isDarkMode));
}

export async function readTheme() {
  const rawTheme = await AsyncStorage.getItem(THEME_KEY);
  if (!rawTheme) return false;
  return rawTheme === 'true';
}

export { TOKEN_KEY };
