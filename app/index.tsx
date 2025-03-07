import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import Colors from '../constants/Colors';

export default function Index() {
  const { isAuthenticated, isLoading, checkAuthStatus } = useAuth();
  const { theme } = useTheme();

  useEffect(() => {
    // Vérifier l'état d'authentification au chargement de la page
    checkAuthStatus();
  }, []);

  // Afficher un indicateur de chargement pendant la vérification de l'authentification
  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors[theme as 'light' | 'dark'].primary} />
      </View>
    );
  }

  // Rediriger vers la page appropriée en fonction de l'état d'authentification
  if (isAuthenticated) {
    return <Redirect href="/(tabs)/home" />;
  } else {
    return <Redirect href="/auth/login" />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
