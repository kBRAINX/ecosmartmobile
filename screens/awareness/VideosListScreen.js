import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Searchbar, Chip, ActivityIndicator } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import mockData from '../../constants/mockData';

export default function VideosListScreen({ navigation }) {
  const [videos, setVideos] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [allTags, setAllTags] = useState([]);

  useEffect(() => {
    // Charger les données
    setTimeout(() => {
      setVideos(mockData.awarenessVideos);

      // Extraire tous les tags uniques
      const tags = new Set();
      mockData.awarenessVideos.forEach(video => {
        video.tags.forEach(tag => tags.add(tag));
      });
      setAllTags(Array.from(tags));

      setIsLoading(false);
    }, 500);
  }, []);

  const toggleTag = (tag) => {
    setSelectedTags(prev => {
      if (prev.includes(tag)) {
        return prev.filter(t => t !== tag);
      } else {
        return [...prev, tag];
      }
    });
  };

  const filteredVideos = videos.filter(video => {
    // Filtrer par recherche
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchQuery.toLowerCase());

    // Filtrer par tags
    const matchesTags = selectedTags.length === 0 ||
                      selectedTags.some(tag => video.tags.includes(tag));

    return matchesSearch && matchesTags;
  });

  const formatDuration = (duration) => {
    return duration;
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#16a34a" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Searchbar
          placeholder="Rechercher une vidéo..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
          iconColor="#16a34a"
        />

        <View style={styles.tagsContainer}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={allTags}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <Chip
                selected={selectedTags.includes(item)}
                onPress={() => toggleTag(item)}
                style={[
                  styles.tagChip,
                  selectedTags.includes(item) && styles.selectedTagChip
                ]}
                textStyle={selectedTags.includes(item) ? { color: '#16a34a' } : {}}
              >
                {item}
              </Chip>
            )}
            ListHeaderComponent={
              selectedTags.length > 0 ? (
                <Chip
                  onPress={() => setSelectedTags([])}
                  style={styles.clearTagsChip}
                >
                  Effacer les filtres
                </Chip>
              ) : null
            }
          />
        </View>
      </View>

      <FlatList
        data={filteredVideos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.videoCard}
            onPress={() => navigation.navigate('VideoDetail', { videoId: item.id })}
          >
            <View style={styles.thumbnailContainer}>
              <Image
                source={{ uri: item.thumbnailUrl }}
                style={styles.thumbnail}
              />
              <View style={styles.duration}>
                <Text style={styles.durationText}>{formatDuration(item.duration)}</Text>
              </View>
              <View style={styles.playButtonOverlay}>
                <View style={styles.playButton}>
                  <Ionicons name="play" size={24} color="#fff" />
                </View>
              </View>
            </View>

            <View style={styles.videoInfo}>
              <Text style={styles.videoTitle} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={styles.videoDescription} numberOfLines={2}>
                {item.description}
              </Text>
              <View style={styles.videoStats}>
                <View style={styles.stat}>
                  <Ionicons name="eye-outline" size={14} color="#666" />
                  <Text style={styles.statText}>{item.views.toLocaleString()}</Text>
                </View>
                <View style={styles.stat}>
                  <Ionicons name="thumbs-up-outline" size={14} color="#666" />
                  <Text style={styles.statText}>{item.likesCount.toLocaleString()}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.videosList}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="videocam-outline" size={48} color="#cbd5e1" />
            <Text style={styles.emptyText}>Aucune vidéo trouvée</Text>
          </View>
        }
      />
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
  header: {
    padding: 16,
    backgroundColor: '#fff',
  },
  searchbar: {
    marginBottom: 12,
  },
  tagsContainer: {
    marginBottom: 8,
  },
  tagChip: {
    margin: 4,
  },
  selectedTagChip: {
    backgroundColor: '#dcfce7',
  },
  clearTagsChip: {
    margin: 4,
    backgroundColor: '#f3f4f6',
  },
  videosList: {
    padding: 16,
  },
  videoCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 2,
  },
  thumbnailContainer: {
    width: 120,
    height: 90,
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  duration: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 2,
  },
  durationText: {
    color: '#fff',
    fontSize: 10,
  },
  playButtonOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoInfo: {
    flex: 1,
    padding: 12,
  },
  videoTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 4,
  },
  videoDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  videoStats: {
    flexDirection: 'row',
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  statText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyText: {
    marginTop: 8,
    color: '#94a3b8',
  },
});
