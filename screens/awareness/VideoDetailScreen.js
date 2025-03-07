import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Video } from 'expo-av';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Divider, ActivityIndicator } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import mockData from '../../constants/mockData';

export default function VideoDetailScreen({ route, navigation }) {
  const { videoId } = route.params;
  const [video, setVideo] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [liked, setLiked] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    // Charger les données de la vidéo
    setTimeout(() => {
      const foundVideo = mockData.awarenessVideos.find(v => v.id === videoId);
      if (foundVideo) {
        setVideo(foundVideo);

        // Trouver des vidéos reliées (par tags)
        const related = mockData.awarenessVideos
          .filter(v => v.id !== videoId && v.tags.some(tag => foundVideo.tags.includes(tag)))
          .slice(0, 3);

        setRelatedVideos(related);
      } else {
        navigation.goBack();
      }

      setIsLoading(false);
    }, 500);
  }, [videoId, navigation]);

  const handlePlaybackStatusUpdate = (status) => {
    setIsPlaying(status.isPlaying);
  };

  const toggleLike = () => {
    setLiked(!liked);
  };

  const goToQuiz = () => {
    if (video && video.relatedQuizId) {
      navigation.navigate('Quiz', { screen: 'QuizDetail', params: { quizId: video.relatedQuizId } });
    }
  };

  if (isLoading || !video) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#16a34a" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.videoContainer}>
          <Video
            ref={videoRef}
            source={{ uri: video.videoUrl }}
            rate={1.0}
            volume={1.0}
            isMuted={false}
            resizeMode="cover"
            shouldPlay={false}
            useNativeControls
            style={styles.video}
            posterSource={{ uri: video.thumbnailUrl }}
            posterStyle={styles.videoPoster}
            onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
          />
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.videoTitle}>{video.title}</Text>

          <View style={styles.videoMeta}>
            <Text style={styles.viewCount}>{video.views.toLocaleString()} vues</Text>

            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={toggleLike}
              >
                <Ionicons
                  name={liked ? "thumbs-up" : "thumbs-up-outline"}
                  size={20}
                  color={liked ? "#16a34a" : "#666"}
                />
                <Text style={[
                  styles.actionText,
                  liked && { color: "#16a34a" }
                ]}>
                  {video.likesCount.toLocaleString()}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="share-social-outline" size={20} color="#666" />
                <Text style={styles.actionText}>Partager</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Divider style={styles.divider} />

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{video.description}</Text>

          <View style={styles.tags}>
            {video.tags.map((tag) => (
              <TouchableOpacity key={tag} style={styles.tag}>
                <Text style={styles.tagText}>#{tag}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Divider style={styles.divider} />

          <View style={styles.quizSection}>
            <Ionicons name="school-outline" size={24} color="#16a34a" style={styles.quizIcon} />
            <View style={styles.quizInfo}>
              <Text style={styles.quizTitle}>Testez vos connaissances</Text>
              <Text style={styles.quizDescription}>
                Répondez aux questions sur cette vidéo et gagnez des points !
              </Text>
            </View>
            <Button
              mode="contained"
              onPress={goToQuiz}
              style={styles.quizButton}
            >
              Quiz
            </Button>
          </View>

          <Divider style={styles.divider} />

          <Text style={styles.sectionTitle}>Vidéos similaires</Text>

          {relatedVideos.map((relatedVideo) => (
            <TouchableOpacity
              key={relatedVideo.id}
              style={styles.relatedVideoItem}
              onPress={() => {
                navigation.setParams({ videoId: relatedVideo.id });
                setVideo(null);
                setIsLoading(true);
              }}
            >
              <Image
                source={{ uri: relatedVideo.thumbnailUrl }}
                style={styles.relatedVideoThumbnail}
              />
              <View style={styles.relatedVideoInfo}>
                <Text style={styles.relatedVideoTitle} numberOfLines={2}>
                  {relatedVideo.title}
                </Text>
                <Text style={styles.relatedVideoViews}>
                  {relatedVideo.views.toLocaleString()} vues
                </Text>
              </View>
            </TouchableOpacity>
          ))}
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
  videoContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  videoPoster: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  contentContainer: {
    padding: 16,
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  videoMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewCount: {
    color: '#666',
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  actionText: {
    marginLeft: 4,
    color: '#666',
  },
  divider: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    color: '#333',
    lineHeight: 20,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  tag: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: '#64748b',
    fontSize: 12,
  },
  quizSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    padding: 12,
    borderRadius: 8,
  },
  quizIcon: {
    marginRight: 12,
  },
  quizInfo: {
    flex: 1,
  },
  quizTitle: {
    fontWeight: 'bold',
  },
  quizDescription: {
    fontSize: 12,
    color: '#666',
  },
  quizButton: {
    backgroundColor: '#16a34a',
  },
  relatedVideoItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  relatedVideoThumbnail: {
    width: 120,
    height: 68,
    borderRadius: 4,
  },
  relatedVideoInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  relatedVideoTitle: {
    fontWeight: '500',
    marginBottom: 4,
  },
  relatedVideoViews: {
    fontSize: 12,
    color: '#666',
  },
});
