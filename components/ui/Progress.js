import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../../constants/theme';

export default function Progress({
  value = 0,
  height = 4,
  backgroundColor = '#e5e7eb',
  color = colors.primary,
  style
}) {
  return (
    <View style={[styles.container, { height, backgroundColor }, style]}>
      <View
        style={[
          styles.bar,
          {
            width: `${Math.min(Math.max(value, 0), 100)}%`,
            backgroundColor: color
          }
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 4,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
  },
});
