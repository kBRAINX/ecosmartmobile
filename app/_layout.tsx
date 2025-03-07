import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ThemeProvider from '../contexts/ThemeContext';
import AuthProvider from '../contexts/AuthContext';
import { useTheme } from '../hooks/useTheme';
import Colors from '../constants/Colors';

// Empêcher la fermeture de l'écran de démarrage automatiquement
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RootLayoutContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

function RootLayoutContent() {
  const { theme, isLoading: isThemeLoading } = useTheme();

  useEffect(() => {
    // Masquer l'écran de démarrage une fois le chargement terminé
    if (!isThemeLoading) {
      SplashScreen.hideAsync();
    }
  }, [isThemeLoading]);

  if (isThemeLoading) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: Colors[theme as 'light' | 'dark'].background,
          },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen
          name="auth/login"
          options={{
            title: 'Connexion',
          }}
        />
        <Stack.Screen
          name="auth/register"
          options={{
            title: 'Inscription',
          }}
        />
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="awareness/videos/[id]"
          options={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="awareness/quiz"
          options={{
            headerShown: false,
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name="settings/profile"
          options={{
            title: 'Profil',
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="settings/points"
          options={{
            title: 'Points',
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="settings/withdraw"
          options={{
            title: 'Retrait',
            animation: 'slide_from_right',
          }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
