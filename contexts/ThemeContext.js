import React, { createContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState('light'); // 'light' ou 'dark'
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Charger le thème enregistré, ou utiliser celui du système par défaut
    loadThemePreference();
  }, []);

  // Charger les préférences de thème
  const loadThemePreference = async () => {
    try {
      const savedTheme = await SecureStore.getItemAsync('theme');

      if (savedTheme) {
        // Utiliser le thème enregistré
        setTheme(savedTheme);
      } else {
        // Utiliser le thème du système par défaut
        setTheme(systemColorScheme || 'light');
      }
    } catch (error) {
      console.error('Erreur lors du chargement des préférences de thème:', error);
      // Utiliser le thème du système par défaut en cas d'erreur
      setTheme(systemColorScheme || 'light');
    } finally {
      setIsLoading(false);
    }
  };

  // Enregistrer les préférences de thème
  const saveThemePreference = async (newTheme) => {
    try {
      await SecureStore.setItemAsync('theme', newTheme);
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement des préférences de thème:', error);
    }
  };

  // Basculer entre les thèmes clair et sombre
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    saveThemePreference(newTheme);
  };

  // Définir explicitement un thème
  const setThemeExplicit = (newTheme) => {
    if (newTheme === 'light' || newTheme === 'dark') {
      setTheme(newTheme);
      saveThemePreference(newTheme);
    }
  };

  // Suivre les changements de thème système
  useEffect(() => {
    // Cette logique peut être ajustée selon vos besoins d'application
    // Par exemple, vous pourriez vouloir toujours suivre le thème système,
    // ou seulement si l'utilisateur n'a pas défini de préférence explicite

    // Ici, nous suivons le thème système seulement si l'application vient de démarrer
    if (isLoading && systemColorScheme) {
      setTheme(systemColorScheme);
    }
  }, [systemColorScheme, isLoading]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDark: theme === 'dark',
        toggleTheme,
        setTheme: setThemeExplicit,
        isLoading
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
