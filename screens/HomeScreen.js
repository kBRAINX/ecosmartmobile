import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Image, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Title, Paragraph, Chip, Avatar } from 'react-native-paper';
import mockData from '../constants/mockData'; // Vos données JSON

export default function HomeScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    // Simuler le chargement des données utilisateur
    setUser(mockData.users[0]);

    // Simuler le chargement des activités récentes
    const scanHistory = mockData.scanHistory.filter(scan => scan.userId === mockData.users[0].id);
    setRecentActivities(scanHistory);
  }, []);

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* En-tête avec profil */}
        <View style={styles.header}>
          <View style={styles.profileContainer}>
            <Avatar.Image source={{ uri: user.avatarUrl }} size={50} />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>Bonjour, {user.name.split(' ')[0]}</Text>
              <Text style={styles.userPoints}>{user.points} points</Text>
            </View>
          </View>
        </View>

        {/* Carte des statistiques */}
        <Card style={styles.statsCard}>
          <Card.Content>
            <Title>Vos statistiques</Title>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{user.scannedWaste}</Text>
                <Text style={styles.statLabel}>Déchets scannés</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{user.quizCompleted}</Text>
                <Text style={styles.statLabel}>Quiz complétés</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{Math.floor(user.points / 5)}</Text>
                <Text style={styles.statLabel}>XAF gagnés</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Actions rapides */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Actions rapides</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('Scanner')}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#3b82f6' }]}>
                <Ionicons name="camera-outline" size={24} color="#fff" />
              </View>
              <Text style={styles.actionText}>Scanner</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('Map')}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#22c55e' }]}>
                <Ionicons name="map-outline" size={24} color="#fff" />
              </View>
              <Text style={styles.actionText}>Carte</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('Awareness')}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#f59e0b' }]}>
                <Ionicons name="book-outline" size={24} color="#fff" />
              </View>
              <Text style={styles.actionText}>Apprendre</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('Settings', { screen: 'Points' })}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#8b5cf6' }]}>
                <Ionicons name="cash-outline" size={24} color="#fff" />
              </View>
              <Text style={styles.actionText}>Retirer</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Activités récentes */}
        <View style={styles.recentActivities}>
          <Text style={styles.sectionTitle}>Activités récentes</Text>
          {recentActivities.length > 0 ? (
            recentActivities.map((activity, index) => {
              const wasteType = mockData.wasteTypes.find(type => type.id === activity.wasteType);

              return (
                <Card key={index} style={styles.activityCard}>
                  <Card.Content style={styles.activityContent}>
                    <View style={[styles.activityIcon, { backgroundColor: `${wasteType.color}20` }]}>
                      <Image
                        source={{ uri: wasteType.icon }}
                        style={{ width: 24, height: 24 }}
                      />
                    </View>
                    <View style={styles.activityDetails}>
                      <Text style={styles.activityTitle}>{wasteType.name} scanné</Text>
                      <Text style={styles.activityMeta}>
                        {new Date(activity.timestamp).toLocaleDateString()} •
                        {activity.pointsEarned} points
                      </Text>
                    </View>
                  </Card.Content>
                </Card>
              );
            })
          ) : (
            <Text style={styles.emptyText}>Aucune activité récente</Text>
          )}
        </View>

        {/* Vidéos recommandées */}
        <View style={styles.recommendedVideos}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Vidéos recommandées</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Awareness')}>
              <Text style={styles.seeAllText}>Voir tout</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={mockData.awarenessVideos}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.videoCard}
                onPress={() => navigation.navigate('Awareness', { screen: 'VideoDetail', params: { videoId: item.id } })}
              >
                <Image
                  source={{ uri: item.thumbnailUrl }}
                  style={styles.videoThumbnail}
                />
                <View style={styles.videoDuration}>
                  <Text style={styles.durationText}>{item.duration}</Text>
                </View>
                <Text numberOfLines={2} style={styles.videoTitle}>{item.title}</Text>
              </TouchableOpacity>
            )}
          />
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
  header: {
    padding: 16,
    backgroundColor: '#fff',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userInfo: {
    marginLeft: 12,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  userPoints: {
    fontSize: 14,
    color: '#16a34a',
  },
  statsCard: {
    margin: 16,
    elevation: 2,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#16a34a',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  quickActions: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    alignItems: 'center',
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
  },
  recentActivities: {
    padding: 16,
  },
  activityCard: {
    marginBottom: 8,
  },
  activityContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityDetails: {
    flex: 1,
  },
  activityTitle: {
    fontWeight: 'bold',
  },
  activityMeta: {
    fontSize: 12,
    color: '#666',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 12,
  },
  recommendedVideos: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  seeAllText: {
    color: '#16a34a',
  },
  videoCard: {
    width: 200,
    marginRight: 12,
  },
  videoThumbnail: {
    width: '100%',
    height: 120,
    borderRadius: 8,
  },
  videoDuration: {
    position: 'absolute',
    bottom: 30,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  durationText: {
    color: '#fff',
    fontSize: 10,
  },
  videoTitle: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: 'bold',
  },
});
