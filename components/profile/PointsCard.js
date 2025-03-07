import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from '../ui/Button';
import { colors } from '../../constants/theme';

export default function PointsCard({ points, onConvertPoints }) {
  // Calculate monetary value (1 XAF = 5 points)
  const monetaryValue = Math.floor(points / 5);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="wallet-outline" size={24} color={colors.primary} />
        <Text style={styles.headerText}>Available Points</Text>
      </View>

      <Text style={styles.pointsValue}>{points}</Text>
      <Text style={styles.pointsEquivalent}>
        Equivalent to {monetaryValue.toLocaleString()} XAF
      </Text>

      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <Text style={styles.levelText}>Level {Math.floor(points / 500) + 1}</Text>
          <Text style={styles.levelProgress}>
            {points % 500}/500 to next level
          </Text>
        </View>

        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBar,
              { width: `${(points % 500) / 500 * 100}%` }
            ]}
          />
        </View>
      </View>

      <Button
        title="Convert Points"
        onPress={onConvertPoints}
        style={styles.convertButton}
        icon={<Ionicons name="cash-outline" size={18} color="#fff" />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  pointsValue: {
    fontSize: 40,
    fontWeight: 'bold',
    color: colors.primary,
  },
  pointsEquivalent: {
    color: '#666',
    marginBottom: 16,
  },
  progressContainer: {
    width: '100%',
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  levelText: {
    fontWeight: '500',
  },
  levelProgress: {
    fontSize: 12,
    color: '#666',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  convertButton: {
    width: '100%',
    backgroundColor: colors.primary,
  },
});
