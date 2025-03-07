import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Video } from 'expo-av';
import ThemedText from '../../components/ThemedText';
import Button from '../../components/ui/Button';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import Colors from '../../constants/Colors';

// Données fictives pour simuler l'API
const mockVideoData = {
  id: '1',
  title: 'Comprendre les différents types de plastiques',
  description: `Les plastiques sont partout dans notre quotidien, mais tous ne sont pas recyclables de la même façon. Dans cette vidéo, vous apprendrez à identifier les 7 types de plastiques couramment utilisés et comment les recycler correctement.

  Nous couvrirons :
  - Les symboles de recyclage et ce qu'ils signifient
  - Quels plastiques sont facilement recyclables
  - Comment préparer vos plastiques pour le recyclage
  - Les erreurs courantes à éviter`,
  videoUrl: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4', // Utiliser une vidéo d'exemple d'Expo
  duration: '5:20',
  points: 20,
  hasQuiz: true,
  relatedVideos: [
    {
      id: '2',
      title: 'Comment composter à la maison',
      thumbnail: 'https://via.placeholder.com/160x90',
      duration: '8:45'
    },
    {
      id: '3',
      title: 'Les erreurs courantes de recyclage',
      thumbnail: 'https://via.placeholder.com/160x90',
      duration: '4:15'
    }
  ]
};

export default function VideoDetailScreen() {
  const { videoId } = useLocalSearchParams();
  const router = useRouter();
  const { theme } = useTheme();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({});
  const videoRef = useRef(null);

  useEffect(() => {
    fetchVideoDetails();
  }, [videoId]);

  const fetchVideoDetails = async () => {
    // Simuler l'appel API
    setLoading(true);
    setTimeout(() => {
      setVideo(mockVideoData);
      setLoading(false);
    }, 500);
  };

  const handleStartQuiz = () => {
    router.push({
      pathname: '/awareness/quiz',
      params: { videoId }
    });
  };

  const handleRelatedVideoPress = (relatedVideoId) => {
    router.push({
      pathname: `/awareness/videos/${relatedVideoId}`,
      params: { videoId: relatedVideoId }
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ThemedText>Chargement...</ThemedText>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors[theme].text} />
        </TouchableOpacity>

        <View style={styles.videoContainer}>
          <Video
            ref={videoRef}
            style={styles.video}
            source={{ uri: video.videoUrl }}
            useNativeControls
            resizeMode="contain"
            isLooping={false}
            onPlaybackStatusUpdate={status => setStatus(() => status)}
          />
        </View>

        <View style={styles.contentContainer}>
          <ThemedText style={styles.title}>{video.title}</ThemedText>

          <View style={styles.metaContainer}>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={16} color={Colors[theme].primary} />
              <ThemedText style={styles.metaText}>{video.duration}</ThemedText>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="trophy-outline" size={16} color={Colors[theme].primary} />
              <ThemedText style={styles.metaText}>{video.points} points</ThemedText>
            </View>
          </View>

          <ThemedText style={styles.sectionTitle}>Description</ThemedText>
          <ThemedText style={styles.description}>{video.description}</ThemedText>

          {video.hasQuiz && (
            <View style={styles.quizSection}>
              <View style={styles.quizCard}>
                <View style={styles.quizIcon}>
                  <Ionicons name="help-circle-outline" size={32} color="#fff" />
                </View>
                <View style={styles.quizContent}>
                  <ThemedText style={styles.quizTitle}>Quiz disponible</ThemedText>
                  <ThemedText style={styles.quizDescription}>
                    Testez vos connaissances et gagnez des points supplémentaires !
                  </ThemedText>
                  <Button
                    title="Commencer le quiz"
                    onPress={handleStartQuiz}
                    style={styles.quizButton}
                  />
                </View>
              </View>
            </View>
          )}

          <ThemedText style={styles.sectionTitle}>Vidéos similaires</ThemedText>
          <View style={styles.relatedVideosContainer}>
            {video.relatedVideos.map(relatedVideo => (
              <TouchableOpacity
                key={relatedVideo.id}
                style={styles.relatedVideoItem}
                onPress={() => handleRelatedVideoPress(relatedVideo.id)}
              >
                <Image
                  source={{ uri: relatedVideo.thumbnail }}
                  style={styles.relatedVideoThumbnail}
                />
                <ThemedText style={styles.relatedVideoTitle} numberOfLines={2}>
                  {relatedVideo.title}
                </ThemedText>
                <View style={styles.relatedVideoDuration}>
                  <Ionicons name="time-outline" size={12} color={Colors[theme].text} />
                  <ThemedText style={styles.relatedVideoDurationText}>
                    {relatedVideo.duration}
                  </ThemedText>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
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
  scrollContainer: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 15,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
  },
  video: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  metaContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metaText: {
    fontSize: 14,
    marginLeft: 4,
    opacity: 0.7,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
  },
  quizSection: {
    marginVertical: 20,
  },
  quizCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  quizIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  quizContent: {
    flex: 1,
  },
  quizTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  quizDescription: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 12,
  },
  quizButton: {
    alignSelf: 'flex-start',
  },
  relatedVideosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  relatedVideoItem: {
    width: '48%',
    marginBottom: 16,
  },
  relatedVideoThumbnail: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 8,
    marginBottom: 6,
  },
  relatedVideoTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  relatedVideoDuration: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  relatedVideoDurationText: {
    fontSize: 12,
    opacity: 0.7,
    marginLeft: 4,
  },
});
