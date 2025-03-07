import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from '../ui/Button';
import { colors } from '../../constants/theme';

export default function QuizQuestion({
  question,
  onAnswer,
  isAnswered = false,
  selectedAnswer = null,
  isLast = false,
  onNext
}) {
  const [localSelection, setLocalSelection] = useState(null);

  const handleOptionPress = (index) => {
    if (isAnswered) return;
    setLocalSelection(index);
  };

  const handleSubmit = () => {
    if (localSelection === null || isAnswered) return;
    onAnswer && onAnswer(localSelection);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.question}>{question.question}</Text>

      <View style={styles.options}>
        {question.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.option,
              localSelection === index && styles.selectedOption,
              isAnswered && index === question.correctAnswer && styles.correctOption,
              isAnswered && selectedAnswer === index && index !== question.correctAnswer && styles.incorrectOption
            ]}
            onPress={() => handleOptionPress(index)}
            disabled={isAnswered}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.optionText,
              localSelection === index && styles.selectedOptionText,
              isAnswered && index === question.correctAnswer && styles.correctOptionText,
              isAnswered && selectedAnswer === index && index !== question.correctAnswer && styles.incorrectOptionText
            ]}>
              {option}
            </Text>

            {isAnswered && index === question.correctAnswer && (
              <Ionicons name="checkmark-circle" size={20} color="#16a34a" style={styles.icon} />
            )}

            {isAnswered && selectedAnswer === index && index !== question.correctAnswer && (
              <Ionicons name="close-circle" size={20} color="#ef4444" style={styles.icon} />
            )}
          </TouchableOpacity>
        ))}
      </View>

      {isAnswered && (
        <View style={styles.explanation}>
          <Text style={styles.explanationTitle}>Explanation:</Text>
          <Text style={styles.explanationText}>{question.explanation}</Text>
        </View>
      )}

      <View style={styles.actionContainer}>
        {!isAnswered ? (
          <Button
            title="Submit Answer"
            onPress={handleSubmit}
            disabled={localSelection === null}
            style={styles.submitButton}
          />
        ) : (
          <Button
            title={isLast ? "Finish Quiz" : "Next Question"}
            onPress={onNext}
            style={styles.nextButton}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  question: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  options: {
    marginBottom: 16,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedOption: {
    backgroundColor: '#f0f9ff',
    borderColor: '#bae6fd',
  },
  correctOption: {
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
  },
  incorrectOption: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
  },
  optionText: {
    fontSize: 16,
    flex: 1,
  },
  selectedOptionText: {
    color: '#0369a1',
  },
  correctOptionText: {
    color: '#16a34a',
  },
  incorrectOptionText: {
    color: '#ef4444',
  },
  icon: {
    marginLeft: 8,
  },
  explanation: {
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  explanationTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  explanationText: {
    color: '#334155',
  },
  actionContainer: {
    alignItems: 'center',
  },
  submitButton: {
    width: '100%',
    backgroundColor: colors.primary,
  },
  nextButton: {
    width: '100%',
    backgroundColor: colors.primary,
  },
});
