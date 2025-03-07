import React from 'react';
import { TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ThemedText from '../ThemedText';
import { useTheme } from '../../hooks/useTheme';
import Colors from '../../constants/Colors';

const Button = ({
  title,
  onPress,
  style,
  textStyle,
  icon,
  iconPosition = 'left',
  variant = 'primary',
  disabled = false,
  loading = false,
  loadingText = 'Chargement...',
  children,
}) => {
  const { theme } = useTheme();

  // Déterminer les styles de base du bouton en fonction de la variante
  const getButtonStyle = () => {
    switch (variant) {
      case 'secondary':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: Colors[theme].primary,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: '#ddd',
        };
      case 'danger':
        return {
          backgroundColor: Colors[theme].error,
        };
      case 'success':
        return {
          backgroundColor: Colors[theme].success,
        };
      case 'primary':
      default:
        return {
          backgroundColor: Colors[theme].primary,
        };
    }
  };

  // Déterminer la couleur du texte en fonction de la variante
  const getTextColor = () => {
    switch (variant) {
      case 'secondary':
      case 'outline':
        return Colors[theme].primary;
      case 'primary':
      case 'danger':
      case 'success':
      default:
        return '#fff';
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getButtonStyle(),
        disabled && styles.disabledButton,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <>
          <ActivityIndicator size="small" color={getTextColor()} style={styles.loadingIndicator} />
          {loadingText && (
            <ThemedText style={[styles.buttonText, { color: getTextColor() }, textStyle]}>
              {loadingText}
            </ThemedText>
          )}
        </>
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <Ionicons
              name={icon}
              size={20}
              color={getTextColor()}
              style={styles.iconLeft}
            />
          )}

          {children || (
            <ThemedText style={[styles.buttonText, { color: getTextColor() }, textStyle]}>
              {title}
            </ThemedText>
          )}

          {icon && iconPosition === 'right' && (
            <Ionicons
              name={icon}
              size={20}
              color={getTextColor()}
              style={styles.iconRight}
            />
          )}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    minHeight: 48,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
  loadingIndicator: {
    marginRight: 8,
  },
});

export default Button;
