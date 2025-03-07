import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import Colors from '../constants/Colors';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  variant?: 'default' | 'card' | 'elevated';
};

export default function ThemedView({
  style,
  lightColor,
  darkColor,
  variant = 'default',
  ...props
}: ThemedViewProps) {
  const { theme } = useTheme();
  const backgroundColor = theme === 'light'
    ? lightColor ?? getBackgroundColor(variant, 'light')
    : darkColor ?? getBackgroundColor(variant, 'dark');

  // Appliquer les styles en fonction de la variante
  const variantStyle = (() => {
    switch (variant) {
      case 'card':
        return styles.card;
      case 'elevated':
        return theme === 'light' ? styles.elevatedLight : styles.elevatedDark;
      case 'default':
      default:
        return null;
    }
  })();

  return <View style={[variantStyle, { backgroundColor }, style]} {...props} />;
}

// Helper pour obtenir la couleur de fond en fonction de la variante et du thème
const getBackgroundColor = (variant: string, theme: 'light' | 'dark') => {
  switch (variant) {
    case 'card':
      return Colors[theme].card;
    case 'elevated':
      return Colors[theme].card;
    case 'default':
    default:
      return Colors[theme].background;
  }
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    padding: 16,
  },
  elevatedLight: {
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  elevatedDark: {
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
});
