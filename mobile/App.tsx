import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { AppNavigator } from '@/navigation/AppNavigator';
import { useAppSelector } from '@/hooks/redux';
import { store } from '@/store';
import { darkTheme, lightTheme } from '@/theme';

function ThemedApp() {
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);
  return (
    <PaperProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <AppNavigator />
    </PaperProvider>
  );
}

export default function App() {
  return (
    <ReduxProvider store={store}>
      <ThemedApp />
    </ReduxProvider>
  );
}
