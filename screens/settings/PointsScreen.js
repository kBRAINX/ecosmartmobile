import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Button, Divider, ActivityIndicator } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import mockData from '../../constants/mockData';

export default function PointsScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Charger les données de l'utilisateur et les transactions
    setTimeout(() => {
      const userData = mockData.users[0];
      setUser(userData);

      // Filtrer les transactions de l'utilisateur
      const userTransactions = mockData.transactions.filter(
        t => t.userId === userData.id
      );
      setTransactions(userTransactions);

      setIsLoading(false);
    }, 500);
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading || !user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#16a34a" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.pointsCard}>
          <Card.Content style={styles.pointsContent}>
            <View style={styles.pointsHeader}>
              <Ionicons name="star" size={24} color="#16a34a" />
              <Text style={styles.pointsHeaderText}>Solde actuel</Text>
            </View>
            <Text style={styles.pointsAmount}>{user.points}</Text>
            <Text style={styles.pointsEquivalent}>
              Équivalent à {Math.floor(user.points / 5).toLocaleString()} XAF
            </Text>
          </Card.Content>
        </Card>

        <View style={styles.progressContainer}>
          <Text style={styles.progressTitle}>Niveau {Math.floor(user.points / 500) + 1}</Text>
          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBar,
                { width: `${(user.points % 500) / 500 * 100}%` }
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {user.points % 500} / 500 points pour le niveau suivant
          </Text>
        </View>

        <Button
          mode="contained"
          onPress={() => navigation.navigate('Withdraw')}
          style={styles.withdrawButton}
          icon="cash-multiple"
        >
          Convertir mes points
        </Button>

        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Statistiques</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Ionicons name="scan-outline" size={28} color="#3b82f6" />
              <Text style={styles.statValue}>{user.scannedWaste}</Text>
              <Text style={styles.statLabel}>Déchets</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="help-circle-outline" size={28} color="#8b5cf6" />
              <Text style={styles.statValue}>{user.quizCompleted}</Text>
              <Text style={styles.statLabel}>Quiz</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="calendar-outline" size={28} color="#f59e0b" />
              <Text style={styles.statValue}>15</Text>
              <Text style={styles.statLabel}>Jours</Text>
            </View>
          </View>
        </View>

        <View style={styles.transactionsContainer}>
          <Text style={styles.sectionTitle}>Historique des transactions</Text>
          {transactions.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="document-outline" size={48} color="#cbd5e1" />
              <Text style={styles.emptyText}>Aucune transaction</Text>
            </View>
          ) : (
            transactions.map((transaction, index) => (
              <Card key={transaction.id} style={styles.transactionCard}>
                <Card.Content style={styles.transactionContent}>
                  <View style={[
                    styles.transactionIconContainer,
                    transaction.type === 'earning'
                      ? styles.earningIcon
                      : styles.withdrawalIcon
                  ]}>
                    <Ionicons
                      name={transaction.type === 'earning' ? 'add' : 'remove'}
                      size={20}
                      color="#fff"
                    />
                  </View>

                  <View style={styles.transactionDetails}>
                    <Text style={styles.transactionTitle}>
                      {transaction.type === 'earning'
                        ? `Gain: ${transaction.details || 'Activité'}`
                        : `Retrait: ${
                            transaction.method === 'wm1'
                              ? 'MTN Mobile Money'
                              : transaction.method === 'wm2'
                                ? 'Orange Money'
                                : 'Carte Bancaire'
                          }`
                      }
                    </Text>
                    <Text style={styles.transactionDate}>
                      {formatDate(transaction.timestamp)}
                    </Text>
                    {transaction.reference && (
                      <Text style={styles.transactionReference}>
                        Réf: {transaction.reference}
                      </Text>
                    )}
                  </View>

                  <View style={styles.transactionValues}>
                    <Text style={[
                      styles.transactionPoints,
                      transaction.type === 'earning'
                        ? styles.earningText
                        : styles.withdrawalText
                    ]}>
                      {transaction.type === 'earning' ? '+' : '-'}{transaction.points} points
                    </Text>
                    {transaction.amount > 0 && (
                      <Text style={styles.transactionAmount}>
                        {transaction.amount.toLocaleString()} XAF
                      </Text>
                    )}
                    <View style={[
                      styles.statusBadge,
                      transaction.status === 'completed'
                        ? styles.completedBadge
                        : transaction.status === 'pending'
                          ? styles.pendingBadge
                          : styles.failedBadge
                    ]}>
                      <Text style={styles.statusText}>
                        {transaction.status === 'completed'
                          ? 'Complété'
                          : transaction.status === 'pending'
                            ? 'En attente'
                            : 'Échoué'}
                      </Text>
                    </View>
                  </View>
                </Card.Content>
              </Card>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 16,
  },
  pointsCard: {
    marginBottom: 16,
    borderRadius: 8,
  },
  pointsContent: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  pointsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointsHeaderText: {
    fontSize: 16,
    marginLeft: 8,
  },
  pointsAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#16a34a',
    marginTop: 8,
  },
  pointsEquivalent: {
    color: '#666',
    marginTop: 4,
  },
  progressContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#16a34a',
  },
  progressText: {
    fontSize: 12,
    color: '#666',
  },
  withdrawButton: {
    marginBottom: 16,
    backgroundColor: '#16a34a',
  },
  statsContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 4,
  },
  statLabel: {
    color: '#666',
    fontSize: 12,
  },
  transactionsContainer: {
    marginBottom: 24,
  },
  emptyContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    color: '#94a3b8',
    marginTop: 8,
  },
  transactionCard: {
    marginBottom: 8,
    borderRadius: 8,
  },
  transactionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  earningIcon: {
    backgroundColor: '#16a34a',
  },
  withdrawalIcon: {
    backgroundColor: '#f97316',
  },
  transactionDetails: {
    flex: 1,
  },
  transactionTitle: {
    fontWeight: '500',
  },
  transactionDate: {
    fontSize: 12,
    color: '#666',
  },
  transactionReference: {
    fontSize: 10,
    color: '#94a3b8',
  },
  transactionValues: {
    alignItems: 'flex-end',
  },
  transactionPoints: {
    fontWeight: '500',
  },
  earningText: {
    color: '#16a34a',
  },
  withdrawalText: {
    color: '#f97316',
  },
  transactionAmount: {
    fontSize: 12,
    color: '#666',
  },
  statusBadge: {
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
  },
  completedBadge: {
    backgroundColor: '#f8fafc',
  },
  pendingBadge: {
    backgroundColor: '#fef3c7',
  },
  failedBadge: {
    backgroundColor: '#fee2e2',
  },
});
