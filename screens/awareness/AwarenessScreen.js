import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import ThemedText from '../../components/ThemedText';
import { useTheme } from '../../hooks/useTheme';
import Colors from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import VideoItem from '../../components/awareness/VideoItem';

// Mock data - à remplacer par des appels API
const VIDEOS_DATA = [
  {
    id: '1',
    title: 'Comprendre les différents types de plastiques',
    duration: '5:20',
    thumbnail: 'https://via.placeholder.com/300x200',
    description: 'Apprenez à identifier les 7 types de plastiques et comment les recycler correctement.',
    views: 1250,
    hasQuiz: true
  },
  {
    id: '2',
    title: 'Comment composter à la maison',
    duration: '8:45',
    thumbnail: 'https://via.placeholder.com/300x200',
    description: 'Guide complet pour démarrer votre propre système de compostage à domicile.',
    views: 980,
    hasQuiz: true
  },
  {
    id: '3',
    title: 'Les erreurs courantes de recyclage',
    duration: '4:15',
    thumbnail: 'https://via.placeholder.com/300x200',
    description: 'Découvrez les erreurs les plus communes que les gens font en recyclant.',
    views: 1823,
    hasQuiz: true
  },
  {
    id: '4',
    title: 'Impact du recyclage sur l\'environnement',
    duration: '10:30',
    thumbnail: 'https://via.placeholder.com/300x200',
    description: 'Comprendre l\'impact positif que votre recyclage a sur notre environnement.',
    views: 2056,
    hasQuiz: false
  }
];

const CATEGORIES = [
  { id: 'all', title: 'Tous' },
  { id: 'plastic', title: 'Plastique' },
  { id: 'paper', title: 'Papier' },
  { id: 'glass', title: 'Verre' },
  { id: 'compost', title: 'Compost' },
  { id: 'metal', title: 'Métal' }
];

export default function AwarenessScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const [videos, setVideos] = useState(VIDEOS_DATA);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchVideos();
  }, [selectedCategory]);

  const fetchVideos = () => {
    setLoading(true);
    // Simuler un appel API basé sur la catégorie
    setTimeout(() => {
      if (selectedCategory === 'all') {
        setVideos(VIDEOS_DATA);
      } else {
        // Filtrer selon la catégorie (simulation)
        setVideos(VIDEOS_DATA.filter((_, index) => index % 2 === 0));
      }
      setLoading(false);
    }, 500);
  };

  const handleVideoPress = (video) => {
    router.push({
      pathname: `/awareness/videos/${video.id}`,
      params: { videoId: video.id }
    });
  };

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        selectedCategory === item.id && {
          backgroundColor: Colors[theme].primary,
        }
      ]}
      onPress={() => setSelectedCategory(item.id)}
    >
      <ThemedText
        style={[
          styles.categoryText,
          selectedCategory === item.id && { color: '#fff' }
        ]}
      >
        {item.title}
      </ThemedText>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Sensibilisation</ThemedText>
        <ThemedText style={styles.subtitle}>
          Apprenez comment recycler correctement et testez vos connaissances
        </ThemedText>
      </View>

      <View style={styles.categoriesContainer}>
        <FlatList
          data={CATEGORIES}
          renderItem={renderCategoryItem}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Ionicons name="play-circle-outline" size={24} color={Colors[theme].primary} />
          <ThemedText style={styles.statValue}>12</ThemedText>
          <ThemedText style={styles.statLabel}>Vidéos vues</ThemedText>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="checkmark-circle-outline" size={24} color={Colors[theme].primary} />
          <ThemedText style={styles.statValue}>8</ThemedText>
          <ThemedText style={styles.statLabel}>Quiz complétés</ThemedText>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="trophy-outline" size={24} color={Colors[theme].primary} />
          <ThemedText style={styles.statValue}>320</ThemedText>
          <ThemedText style={styles.statLabel}>Points gagnés</ThemedText>
        </View>
      </View>

      <FlatList
        data={videos}
        renderItem={({ item }) => (
          <VideoItem video={item} onPress={() => handleVideoPress(item)} />
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.videosList}
        showsVerticalScrollIndicator={false}
        onRefresh={fetchVideos}
        refreshing={loading}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 4,
  },
  categoriesContainer: {
    marginBottom: 16,
  },
  categoriesList: {
    paddingVertical: 8,
  },
  categoryItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#f0f0f0',
  },
  categoryText: {
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    marginHorizontal: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  videosList: {
    paddingBottom: 20,
  },
});
