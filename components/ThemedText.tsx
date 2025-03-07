import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import Colors from '../constants/Colors';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  variant?: 'body' | 'title' | 'subtitle' | 'caption' | 'button' | 'headline';
};

export default function ThemedText({
  style,
  lightColor,
  darkColor,
  variant = 'body',
  ...props
}: ThemedTextProps) {
  const { theme } = useTheme();
  const color = theme === 'light' ? lightColor ?? Colors.light.text : darkColor ?? Colors.dark.text;

  // Appliquer les styles en fonction de la variante
  const variantStyle = (() => {
    switch (variant) {
      case 'headline':
        return styles.headline;
      case 'title':
        return styles.title;
      case 'subtitle':
        return styles.subtitle;
      case 'caption':
        return styles.caption;
      case 'button':
        return styles.button;
      case 'body':
      default:
        return styles.body;
    }
  })();

  return <Text style={[variantStyle, { color }, style]} {...props} />;
}

const styles = StyleSheet.create({
  headline: {
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 0.15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 0.15,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.15,
  },
  body: {
    fontSize: 14,
    letterSpacing: 0.25,
  },
  caption: {
    fontSize: 12,
    letterSpacing: 0.4,
  },
  button: {
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 1.25,
    textTransform: 'uppercase',
  },
});
