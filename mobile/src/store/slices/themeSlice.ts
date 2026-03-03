import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { persistTheme, readTheme } from '@/services/storage';

type ThemeState = {
  isDarkMode: boolean;
};

const initialState: ThemeState = {
  isDarkMode: false,
};

export const hydrateTheme = createAsyncThunk('theme/hydrateTheme', async () => {
  return readTheme();
});

export const toggleThemePersisted = createAsyncThunk(
  'theme/toggleThemePersisted',
  async (isDarkMode: boolean) => {
    const nextMode = !isDarkMode;
    await persistTheme(nextMode);
    return nextMode;
  },
);

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(hydrateTheme.fulfilled, (state, action) => {
        state.isDarkMode = action.payload;
      })
      .addCase(toggleThemePersisted.fulfilled, (state, action) => {
        state.isDarkMode = action.payload;
      });
  },
});

export default themeSlice.reducer;
