import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Badge from '../ui/Badge';
import { colors } from '../../constants/theme';

export default function QuizItem({ quiz, completed = false, onPress, style }) {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        completed && styles.completedContainer,
        style
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={2}>{quiz.title}</Text>
        {completed && (
          <Badge
            label="Completed"
            color={colors.primary}
            size="small"
          />
        )}
      </View>

      <Text style={styles.description} numberOfLines={2}>{quiz.description}</Text>

      <View style={styles.meta}>
        <View style={styles.stat}>
          <Ionicons name="time-outline" size={14} color="#666" />
          <Text style={styles.statText}>
            {Math.floor(quiz.timeLimit / 60)}:{(quiz.timeLimit % 60).toString().padStart(2, '0')}
          </Text>
        </View>

        <View style={styles.stat}>
          <Ionicons name="star-outline" size={14} color="#666" />
          <Text style={styles.statText}>{quiz.points} points</Text>
        </View>

        <View style={styles.stat}>
          <Ionicons name="help-circle-outline" size={14} color="#666" />
          <Text style={styles.statText}>{quiz.questions.length} questions</Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>
            {completed ? 'Retry Quiz' : 'Start Quiz'}
          </Text>
          <Ionicons name="arrow-forward" size={16} color={colors.primary} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  completedContainer: {
    backgroundColor: '#f0fdf4',
    borderColor: '#dcfce7',
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  meta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 4,
  },
  statText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  buttonContainer: {
    alignItems: 'flex-end',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#f9fafb',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
    marginRight: 4,
  },
});
