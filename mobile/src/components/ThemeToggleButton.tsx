import React from 'react';
import { IconButton } from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { toggleThemePersisted } from '@/store/slices/themeSlice';

export function ThemeToggleButton() {
  const dispatch = useAppDispatch();
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  return (
    <IconButton
      icon={isDarkMode ? 'weather-sunny' : 'weather-night'}
      onPress={() => dispatch(toggleThemePersisted(isDarkMode))}
      accessibilityLabel="Toggle app theme"
    />
  );
}
