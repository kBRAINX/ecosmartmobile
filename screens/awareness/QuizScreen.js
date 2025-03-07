import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ThemedText from '../../components/ThemedText';
import Button from '../../components/ui/Button';
import ProgressBar from '../../components/ui/Progress';
import { useTheme } from '../../hooks/useTheme';
import Colors from '../../constants/Colors';
import QuizQuestion from '../../components/awareness/QuizQuestion';

// Données fictives pour simuler l'API
const mockQuizData = {
  id: '1',
  title: 'Quiz sur les types de plastiques',
  description: 'Testez vos connaissances sur les différents types de plastiques et leur recyclage',
  videoId: '1',
  totalPoints: 50,
  passingScore: 70,
  questions: [
    {
      id: '1',
      question: 'Quel symbole de recyclage représente le PET (polyéthylène téréphtalate) ?',
      options: [
        { id: 'a', text: 'Le chiffre 1' },
        { id: 'b', text: 'Le chiffre 3' },
        { id: 'c', text: 'Le chiffre 5' },
        { id: 'd', text: 'Le chiffre 7' }
      ],
      correctAnswer: 'a',
      explanation: 'Le PET, utilisé pour les bouteilles d\'eau et de soda, est représenté par le chiffre 1 dans le symbole de recyclage.'
    },
    {
      id: '2',
      question: 'Lequel de ces types de plastique est le plus difficile à recycler ?',
      options: [
        { id: 'a', text: 'PET (1)' },
        { id: 'b', text: 'HDPE (2)' },
        { id: 'c', text: 'PVC (3)' },
        { id: 'd', text: 'PP (5)' }
      ],
      correctAnswer: 'c',
      explanation: 'Le PVC (3) est l\'un des plastiques les plus difficiles à recycler en raison de sa composition chimique qui contient du chlore.'
    },
    {
      id: '3',
      question: 'Que devriez-vous faire avec les bouchons en plastique des bouteilles avant de recycler ?',
      options: [
        { id: 'a', text: 'Toujours les retirer et les jeter' },
        { id: 'b', text: 'Les laisser sur la bouteille' },
        { id: 'c', text: 'Les donner à des associations caritatives' },
        { id: 'd', text: 'Les brûler' }
      ],
      correctAnswer: 'b',
      explanation: 'Dans la plupart des systèmes modernes de recyclage, il est recommandé de laisser les bouchons sur les bouteilles car ils sont faits de plastique recyclable.'
    },
    {
      id: '4',
      question: 'Lequel de ces plastiques est communément utilisé pour les sacs de courses ?',
      options: [
        { id: 'a', text: 'PET (1)' },
        { id: 'b', text: 'LDPE (4)' },
        { id: 'c', text: 'PS (6)' },
        { id: 'd', text: 'PC (7)' }
      ],
      correctAnswer: 'b',
      explanation: 'Le LDPE (polyéthylène basse densité) est couramment utilisé pour fabriquer des sacs plastiques, des films alimentaires et certains emballages.'
    },
    {
      id: '5',
      question: 'Quelle est la meilleure pratique pour recycler des contenants en plastique ayant contenu de la nourriture ?',
      options: [
        { id: 'a', text: 'Les jeter directement dans le bac de recyclage' },
        { id: 'b', text: 'Les rincer légèrement avant de les recycler' },
        { id: 'c', text: 'Les laver au lave-vaisselle avant de les recycler' },
        { id: 'd', text: 'Ne pas les recycler du tout' }
      ],
      correctAnswer: 'b',
      explanation: 'Il est recommandé de rincer légèrement les contenants en plastique pour enlever les résidus alimentaires avant de les recycler, mais un nettoyage excessif gaspille de l\'eau.'
    }
  ]
};

export default function QuizScreen() {
  const { videoId } = useLocalSearchParams();
  const router = useRouter();
  const { theme } = useTheme();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);

  useEffect(() => {
    fetchQuizData();
  }, [videoId]);

  const fetchQuizData = async () => {
    // Simuler l'appel API
    setLoading(true);
    setTimeout(() => {
      setQuiz(mockQuizData);
      setLoading(false);
    }, 500);
  };

  const handleAnswer = (questionId, answerId) => {
    setUserAnswers({
      ...userAnswers,
      [questionId]: answerId
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      calculateScore();
      setShowResults(true);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const calculateScore = () => {
    let correctAnswers = 0;
    quiz.questions.forEach(question => {
      if (userAnswers[question.id] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    const calculatedScore = Math.round((correctAnswers / quiz.questions.length) * 100);
    setScore(calculatedScore);
    return calculatedScore;
  };

  const handleFinish = () => {
    const earnedPoints = score >= quiz.passingScore ? quiz.totalPoints : Math.round(quiz.totalPoints * (score / 100));
    Alert.alert(
      'Quiz terminé !',
      `Vous avez obtenu ${score}% et gagné ${earnedPoints} points.`,
      [
        {
          text: 'OK',
          onPress: () => router.push('/awareness')
        }
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ThemedText>Chargement...</ThemedText>
      </SafeAreaView>
    );
  }

  if (showResults) {
    const isPassed = score >= quiz.passingScore;
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.resultsContainer}>
          <View style={[styles.scoreCircle, {
            backgroundColor: isPassed ? Colors[theme].success : Colors[theme].error
          }]}>
            <ThemedText style={styles.scoreText}>{score}%</ThemedText>
          </View>

          <ThemedText style={styles.resultTitle}>
            {isPassed ? 'Félicitations !' : 'Essayez encore !'}
          </ThemedText>

          <ThemedText style={styles.resultText}>
            {isPassed
              ? `Vous avez réussi le quiz avec un score de ${score}%. Vous avez gagné ${quiz.totalPoints} points !`
              : `Vous avez obtenu ${score}%, mais il vous faut ${quiz.passingScore}% pour réussir complètement. Vous avez gagné ${Math.round(quiz.totalPoints * (score / 100))} points.`}
          </ThemedText>

          <View style={styles.questionsReview}>
            <ThemedText style={styles.reviewTitle}>Revue des questions</ThemedText>

            {quiz.questions.map((question, index) => {
              const isCorrect = userAnswers[question.id] === question.correctAnswer;
              return (
                <View key={question.id} style={styles.reviewItem}>
                  <View style={styles.reviewHeader}>
                    <ThemedText style={styles.reviewQuestionNumber}>
                      Question {index + 1}
                    </ThemedText>
                    <View style={[styles.reviewStatus, {
                      backgroundColor: isCorrect ? Colors[theme].success : Colors[theme].error
                    }]}>
                      <ThemedText style={styles.reviewStatusText}>
                        {isCorrect ? 'Correct' : 'Incorrect'}
                      </ThemedText>
                    </View>
                  </View>

                  <ThemedText style={styles.reviewQuestion}>{question.question}</ThemedText>

                  <ThemedText style={styles.reviewAnswer}>
                    <ThemedText style={{ fontWeight: 'bold' }}>Votre réponse: </ThemedText>
                    {question.options.find(opt => opt.id === userAnswers[question.id])?.text || 'Non répondu'}
                  </ThemedText>

                  {!isCorrect && (
                    <ThemedText style={styles.reviewCorrectAnswer}>
                      <ThemedText style={{ fontWeight: 'bold' }}>Réponse correcte: </ThemedText>
                      {question.options.find(opt => opt.id === question.correctAnswer)?.text}
                    </ThemedText>
                  )}

                  <ThemedText style={styles.reviewExplanation}>{question.explanation}</ThemedText>
                </View>
              );
            })}
          </View>

          <Button
            title="Terminer"
            onPress={handleFinish}
            style={styles.finishButton}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors[theme].text} />
        </TouchableOpacity>
        <ThemedText style={styles.title}>{quiz.title}</ThemedText>
      </View>

      <View style={styles.progressContainer}>
        <ThemedText style={styles.progressText}>
          Question {currentQuestionIndex + 1}/{quiz.questions.length}
        </ThemedText>
        <ProgressBar progress={progress} />
      </View>

      <ScrollView style={styles.questionContainer}>
        <QuizQuestion
          question={currentQuestion}
          selectedAnswer={userAnswers[currentQuestion.id]}
          onSelectAnswer={(answerId) => handleAnswer(currentQuestion.id, answerId)}
        />
      </ScrollView>

      <View style={styles.navigationButtons}>
        <Button
          title="Précédent"
          onPress={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
          style={[
            styles.navButton,
            currentQuestionIndex === 0 && styles.disabledButton
          ]}
        />
        <Button
          title={currentQuestionIndex === quiz.questions.length - 1 ? "Terminer" : "Suivant"}
          onPress={handleNextQuestion}
          disabled={!userAnswers[currentQuestion.id]}
          style={[
            styles.navButton,
            !userAnswers[currentQuestion.id] && styles.disabledButton
          ]}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  progressContainer: {
    padding: 16,
  },
  progressText: {
    marginBottom: 8,
  },
  questionContainer: {
    flex: 1,
    padding: 16,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  navButton: {
    flex: 0.48,
  },
  disabledButton: {
    opacity: 0.5,
  },
  // Styles pour les résultats
  resultsContainer: {
    padding: 16,
    alignItems: 'center',
  },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 24,
  },
  scoreText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  resultText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  questionsReview: {
    width: '100%',
    marginVertical: 16,
  },
  reviewTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  reviewItem: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 16,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewQuestionNumber: {
    fontWeight: 'bold',
  },
  reviewStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  reviewStatusText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  reviewQuestion: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
  },
  reviewAnswer: {
    marginBottom: 8,
  },
  reviewCorrectAnswer: {
    marginBottom: 8,
    color: Colors.light.success,
  },
  reviewExplanation: {
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 4,
    marginTop: 8,
  },
  finishButton: {
    marginVertical: 20,
    width: '100%',
  },
});
