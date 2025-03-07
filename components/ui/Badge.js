import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Badge({
  label,
  variant = 'default',
  size = 'medium',
  color,
  style,
  textStyle,
  ...props
}) {
  const getBadgeStyle = () => {
    let baseStyle = [styles.badge];

    // Variant
    if (variant === 'default') {
      baseStyle.push(styles.defaultBadge);
    } else if (variant === 'outlined') {
      baseStyle.push(styles.outlinedBadge);
    }

    // Size
    if (size === 'small') {
      baseStyle.push(styles.smallBadge);
    } else if (size === 'large') {
      baseStyle.push(styles.largeBadge);
    }

    // Custom color
    if (color) {
      if (variant === 'default') {
        baseStyle.push({ backgroundColor: color });
      } else if (variant === 'outlined') {
        baseStyle.push({ borderColor: color });
      }
    }

    // Custom style
    if (style) {
      baseStyle.push(style);
    }

    return baseStyle;
  };

  const getTextStyle = () => {
    let baseStyle = [styles.text];

    // Variant
    if (variant === 'default') {
      baseStyle.push(styles.defaultText);
    } else if (variant === 'outlined') {
      baseStyle.push(styles.outlinedText);
    }

    // Size
    if (size === 'small') {
      baseStyle.push(styles.smallText);
    } else if (size === 'large') {
      baseStyle.push(styles.largeText);
    }

    // Custom color for text
    if (color && variant === 'outlined') {
      baseStyle.push({ color });
    }

    // Custom text style
    if (textStyle) {
      baseStyle.push(textStyle);
    }

    return baseStyle;
  };

  return (
    <View style={getBadgeStyle()} {...props}>
      <Text style={getTextStyle()}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  defaultBadge: {
    backgroundColor: '#16a34a',
  },
  outlinedBadge: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#16a34a',
  },
  smallBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  largeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  text: {
    fontSize: 12,
    fontWeight: '500',
  },
  defaultText: {
    color: '#fff',
  },
  outlinedText: {
    color: '#16a34a',
  },
  smallText: {
    fontSize: 10,
  },
  largeText: {
    fontSize: 14,
  },
});
