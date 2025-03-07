import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ThemedText from '../../components/ThemedText';
import TransactionItem from '../../components/profile/TransactionItem';
import { useTheme } from '../../hooks/useTheme';
import Colors from '../../constants/Colors';

// Données fictives pour l'historique des points
const MOCK_TRANSACTIONS = [
  {
    id: '1',
    type: 'earn',
    title: 'Recyclage de bouteille en plastique',
    points: 10,
    date: '2025-03-06T14:30:00Z',
    category: 'scan'
  },
  {
    id: '2',
    type: 'earn',
    title: 'Quiz complété: Les plastiques',
    points: 20,
    date: '2025-03-05T10:15:00Z',
    category: 'quiz'
  },
  {
    id: '3',
    type: 'spend',
    title: 'Coupon de réduction acheté',
    points: -50,
    date: '2025-03-03T16:45:00Z',
    category: 'coupon'
  },
  {
    id: '4',
    type: 'earn',
    title: 'Recyclage de canette en aluminium',
    points: 15,
    date: '2025-03-02T09:20:00Z',
    category: 'scan'
  },
  {
    id: '5',
    type: 'earn',
    title: 'Badge obtenu: 10 scans',
    points: 30,
    date: '2025-03-01T11:10:00Z',
    category: 'badge'
  },
  {
    id: '6',
    type: 'spend',
    title: 'Don à l\'association EcoTerre',
    points: -100,
    date: '2025-02-28T13:40:00Z',
    category: 'donation'
  },
  {
    id: '7',
    type: 'earn',
    title: 'Recyclage de papier',
    points: 5,
    date: '2025-02-27T15:30:00Z',
    category: 'scan'
  },
  {
    id: '8',
    type: 'earn',
    title: 'Participation événement de nettoyage',
    points: 200,
    date: '2025-02-25T08:30:00Z',
    category: 'event'
  }
];

export default function PointsScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all', 'earn', or 'spend'
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    applyFilter();
  }, [filter]);

  const fetchTransactions = () => {
    // Simuler un appel API
    setIsLoading(true);
    setTimeout(() => {
      setTransactions(MOCK_TRANSACTIONS);
      setIsLoading(false);
    }, 500);
  };

  const applyFilter = () => {
    if (filter === 'all') {
      setTransactions(MOCK_TRANSACTIONS);
    } else if (filter === 'earn') {
      setTransactions(MOCK_TRANSACTIONS.filter(t => t.type === 'earn'));
    } else if (filter === 'spend') {
      setTransactions(MOCK_TRANSACTIONS.filter(t => t.type === 'spend'));
    }
  };

  // Calculer le total des points gagnés et dépensés
  const totalEarned = MOCK_TRANSACTIONS
    .filter(t => t.type === 'earn')
    .reduce((sum, t) => sum + t.points, 0);

  const totalSpent = MOCK_TRANSACTIONS
    .filter(t => t.type === 'spend')
    .reduce((sum, t) => sum + Math.abs(t.points), 0);

  // Groupe les transactions par date (jour)
  const groupTransactionsByDate = () => {
    // Créer un objet pour stocker les transactions groupées
    const grouped = {};

    transactions.forEach(transaction => {
      // Extraire la date sans l'heure
      const date = new Date(transaction.date);
      const dateKey = date.toISOString().split('T')[0]; // Format: YYYY-MM-DD

      // Si cette date n'existe pas encore dans l'objet groupé, créer un tableau vide
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }

      // Ajouter la transaction au tableau correspondant à sa date
      grouped[dateKey].push(transaction);
    });

    // Convertir l'objet en tableau pour FlatList
    return Object.entries(grouped).map(([date, items]) => ({
      date,
      data: items
    })).sort((a, b) => new Date(b.date) - new Date(a.date)); // Trier par date décroissante
  };

  // Formater la date pour l'affichage
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Si c'est aujourd'hui
    if (date.toDateString() === today.toDateString()) {
      return "Aujourd'hui";
    }

    // Si c'est hier
    if (date.toDateString() === yesterday.toDateString()) {
      return "Hier";
    }

    // Sinon, formater la date
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const renderSectionHeader = ({ date }) => (
    <View style={styles.sectionHeader}>
      <ThemedText style={styles.sectionHeaderText}>{formatDate(date)}</ThemedText>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors[theme].text} />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Historique des points</ThemedText>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.summary}>
        <View style={styles.summaryItem}>
          <ThemedText style={styles.summaryValue}>{totalEarned}</ThemedText>
          <ThemedText style={styles.summaryLabel}>Points gagnés</ThemedText>
        </View>
        <View style={styles.divider} />
        <View style={styles.summaryItem}>
          <ThemedText style={styles.summaryValue}>{totalSpent}</ThemedText>
          <ThemedText style={styles.summaryLabel}>Points dépensés</ThemedText>
        </View>
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === 'all' && {backgroundColor: Colors[theme].primary}
          ]}
          onPress={() => setFilter('all')}
        >
          <ThemedText style={[
            styles.filterButtonText,
            filter === 'all' && styles.activeFilterText
          ]}>Tous</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === 'earn' && {backgroundColor: Colors[theme].primary}
          ]}
          onPress={() => setFilter('earn')}
        >
          <ThemedText style={[
            styles.filterButtonText,
            filter === 'earn' && styles.activeFilterText
          ]}>Gagnés</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === 'spend' && {backgroundColor: Colors[theme].primary}
          ]}
          onPress={() => setFilter('spend')}
        >
          <ThemedText style={[
            styles.filterButtonText,
            filter === 'spend' && styles.activeFilterText
          ]}>Dépensés</ThemedText>
        </TouchableOpacity>
      </View>

      <FlatList
        data={groupTransactionsByDate()}
        keyExtractor={(item) => item.date}
        renderItem={({ item }) => (
          <View>
            {renderSectionHeader(item)}
            {item.data.map((transaction) => (
              <TransactionItem key={transaction.id} transaction={transaction} />
            ))}
          </View>
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 24, // Pour équilibrer le bouton retour
  },
  summary: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    margin: 16,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 14,
    opacity: 0.7,
  },
  divider: {
    width: 1,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 8,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginHorizontal: 4,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  filterButtonText: {
    fontSize: 14,
  },
  activeFilterText: {
    color: 'white',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  sectionHeader: {
    paddingVertical: 12,
    backgroundColor: 'transparent',
    marginTop: 8,
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
