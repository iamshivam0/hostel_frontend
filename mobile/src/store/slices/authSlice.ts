import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/types';
import { clearSession, persistSession, readSession } from '@/services/storage';

type AuthState = {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  initializing: boolean;
};

const initialState: AuthState = {
  token: null,
  user: null,
  isAuthenticated: false,
  initializing: true,
};

export const hydrateAuth = createAsyncThunk('auth/hydrateAuth', async () => {
  const session = await readSession();
  return session;
});

export const logoutAndClear = createAsyncThunk('auth/logoutAndClear', async () => {
  await clearSession();
});

export const saveSession = createAsyncThunk(
  'auth/saveSession',
  async (payload: { token: string; user: User }) => {
    await persistSession(payload.token, payload.user);
    return payload;
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setSession: (state, action: PayloadAction<{ token: string; user: User }>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveSession.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(hydrateAuth.fulfilled, (state, action) => {
        if (action.payload) {
          state.token = action.payload.token;
          state.user = action.payload.user;
          state.isAuthenticated = true;
        }
        state.initializing = false;
      })
      .addCase(hydrateAuth.rejected, (state) => {
        state.initializing = false;
      })
      .addCase(logoutAndClear.fulfilled, () => ({ ...initialState, initializing: false }));
  },
});

export const { setSession } = authSlice.actions;
export default authSlice.reducer;
