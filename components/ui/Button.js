import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors } from '../../constants/theme';

export default function Button({
  title,
  onPress,
  variant = 'filled',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  style,
  textStyle,
  ...props
}) {
  const getContainerStyle = () => {
    let baseStyle = [styles.container];

    // Variant
    if (variant === 'filled') {
      baseStyle.push(styles.filledContainer);
    } else if (variant === 'outlined') {
      baseStyle.push(styles.outlinedContainer);
    } else if (variant === 'text') {
      baseStyle.push(styles.textContainer);
    }

    // Size
    if (size === 'small') {
      baseStyle.push(styles.smallContainer);
    } else if (size === 'large') {
      baseStyle.push(styles.largeContainer);
    }

    // Disabled
    if (disabled) {
      baseStyle.push(styles.disabledContainer);
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
    if (variant === 'filled') {
      baseStyle.push(styles.filledText);
    } else if (variant === 'outlined') {
      baseStyle.push(styles.outlinedText);
    } else if (variant === 'text') {
      baseStyle.push(styles.textOnlyText);
    }

    // Size
    if (size === 'small') {
      baseStyle.push(styles.smallText);
    } else if (size === 'large') {
      baseStyle.push(styles.largeText);
    }

    // Disabled
    if (disabled) {
      baseStyle.push(styles.disabledText);
    }

    // Custom text style
    if (textStyle) {
      baseStyle.push(textStyle);
    }

    return baseStyle;
  };

  return (
    <TouchableOpacity
      style={getContainerStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'filled' ? '#fff' : colors.primary} />
      ) : (
        <>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <Text style={getTextStyle()}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  filledContainer: {
    backgroundColor: colors.primary,
  },
  outlinedContainer: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  textContainer: {
    backgroundColor: 'transparent',
    paddingHorizontal: 8,
  },
  smallContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  largeContainer: {
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  disabledContainer: {
    opacity: 0.5,
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  filledText: {
    color: '#fff',
  },
  outlinedText: {
    color: colors.primary,
  },
  textOnlyText: {
    color: colors.primary,
  },
  smallText: {
    fontSize: 14,
  },
  largeText: {
    fontSize: 18,
  },
  disabledText: {
    opacity: 0.8,
  },
  iconContainer: {
    marginRight: 8,
  },
});
