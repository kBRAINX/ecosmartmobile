import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import ThemedText from '../../components/ThemedText';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { useTheme } from '../../hooks/useTheme';
import Colors from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';

export default function HomeScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { user } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [userStats, setUserStats] = useState({
    points: 0,
    scans: 0,
    recyclables: 0
  });

  const [news, setNews] = useState([
    {
      id: 1,
      title: "Comment recycler correctement les emballages plastiques",
      image: "https://via.placeholder.com/150",
      date: "10 mars 2025"
    },
    {
      id: 2,
      title: "Nouvelle installation de poubelles intelligentes",
      image: "https://via.placeholder.com/150",
      date: "5 mars 2025"
    }
  ]);

  useEffect(() => {
    // Récupérer les données utilisateur et actualités
    fetchUserData();
    fetchNews();
  }, []);

  const fetchUserData = () => {
    // Simuler la récupération des données utilisateur
    setTimeout(() => {
      setUserStats({
        points: 350,
        scans: 28,
        recyclables: 46
      });
    }, 500);
  };

  const fetchNews = () => {
    // Simuler la récupération des actualités
    // Remplacer par un appel API réel
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchUserData();
    fetchNews();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const navigateToScanner = () => {
    router.push('/scanner');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <ThemedText style={styles.greeting}>
            Bonjour, {user?.name || 'Utilisateur'}
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Prêt à contribuer à l'environnement aujourd'hui ?
          </ThemedText>
        </View>

        <StatsWidget
          points={userStats.points}
          scans={userStats.scans}
          recyclables={userStats.recyclables}
        />

        <View style={styles.featuresContainer}>
          <FeatureCard
            title="Scanner"
            icon="scan-outline"
            description="Identifiez vos déchets"
            onPress={() => router.push('/scanner')}
            color={Colors[theme].primary}
          />
          <FeatureCard
            title="Localiser"
            icon="map-outline"
            description="Trouvez les poubelles à proximité"
            onPress={() => router.push('/map')}
            color={Colors[theme].secondary}
          />
        </View>

        <View style={styles.newsSection}>
          <ThemedText style={styles.sectionTitle}>Actualités</ThemedText>
          {news.map(item => (
            <NewsItem
              key={item.id}
              title={item.title}
              image={item.image}
              date={item.date}
              onPress={() => {}}
            />
          ))}
        </View>

        <View style={styles.learningSection}>
          <ThemedText style={styles.sectionTitle}>Apprendre</ThemedText>
          <Card style={styles.learningCard}>
            <View style={styles.learningContent}>
              <Ionicons name="school-outline" size={32} color={Colors[theme].primary} />
              <View style={styles.learningText}>
                <ThemedText style={styles.learningTitle}>
                  Découvrez nos vidéos éducatives
                </ThemedText>
                <ThemedText style={styles.learningSubtitle}>
                  Apprenez comment trier et recycler correctement.
                </ThemedText>
              </View>
            </View>
            <Button
              title="Découvrir"
              onPress={() => router.push('/awareness')}
              style={styles.actionButton}
            />
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    marginTop: 8,
    marginBottom: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    marginTop: 4,
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  newsSection: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  learningSection: {
    marginVertical: 20,
  },
  learningCard: {
    padding: 16,
  },
  learningContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  learningText: {
    marginLeft: 12,
    flex: 1,
  },
  learningTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  learningSubtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  actionButton: {
    alignSelf: 'flex-end',
  },
});
