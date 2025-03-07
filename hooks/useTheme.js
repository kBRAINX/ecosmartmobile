import { useContext } from 'react';
import { useColorScheme } from 'react-native';
import { ThemeContext } from '../contexts/ThemeContext';

export const useTheme = () => {
  const context = useContext(ThemeContext);
  const systemColorScheme = useColorScheme();

  if (context === undefined) {
    // Si le contexte n'est pas disponible, utiliser le schéma de couleur du système par défaut
    const isDark = systemColorScheme === 'dark';
    return {
      theme: isDark ? 'dark' : 'light',
      isDark,
      toggleTheme: () => {
        console.warn('ThemeContext non disponible, utilisation des valeurs par défaut');
      },
    };
  }

  return context;
};

export default useTheme;
