import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, FlatList, Image } from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Card, Chip, Button, Searchbar, ActivityIndicator } from 'react-native-paper';
import mockData from '../constants/mockData';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.02;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default function MapScreen() {
  const [region, setRegion] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [bins, setBins] = useState([]);
  const [selectedBin, setSelectedBin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState([]);
  const [wasteTypes, setWasteTypes] = useState([]);
  const mapRef = useRef(null);

  useEffect(() => {
    (async () => {
      // Demander la permission de géolocalisation
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        setLoading(false);
        return;
      }

      try {
        // Obtenir la position actuelle
        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;

        // Définir la région et la position de l'utilisateur
        const initialRegion = {
          latitude,
          longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        };

        setRegion(initialRegion);
        setUserLocation({
          latitude,
          longitude,
        });

        // Charger les données
        setBins(mockData.wasteBins);
        setWasteTypes(mockData.wasteTypes);
        setLoading(false);
      } catch (error) {
        console.error('Error getting location:', error);
        // Utiliser une position par défaut en cas d'erreur
        const defaultRegion = {
          latitude: 4.061536,
          longitude: 9.786072,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        };
        setRegion(defaultRegion);
        setBins(mockData.wasteBins);
        setWasteTypes(mockData.wasteTypes);
        setLoading(false);
      }
    })();
  }, []);

  const handleMarkerPress = (bin) => {
    setSelectedBin(bin);
  };

  const resetMap = () => {
    if (userLocation && mapRef.current) {
      mapRef.current.animateToRegion({
        ...userLocation,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      });
    }
    setSelectedBin(null);
  };

  const navigateToBin = () => {
    if (selectedBin && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: selectedBin.location.latitude,
        longitude: selectedBin.location.longitude,
        latitudeDelta: LATITUDE_DELTA / 2,
        longitudeDelta: LONGITUDE_DELTA / 2,
      });
    }
  };

  const toggleFilter = (typeId) => {
    setActiveFilters(prev => {
      if (prev.includes(typeId)) {
        return prev.filter(id => id !== typeId);
      } else {
        return [...prev, typeId];
      }
    });
  };

  const filteredBins = bins.filter(bin => {
    // Filtre par recherche
    const matchesSearch = bin.name.toLowerCase().includes(searchQuery.toLowerCase());

    // Filtre par type de déchet
    const matchesType = activeFilters.length === 0 ||
                       bin.types.some(type => activeFilters.includes(type));

    return matchesSearch && matchesType;
  });

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return null;

    const R = 6371; // Rayon de la Terre en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;

    return distance;
  };

  const formatDistance = (distance) => {
    if (!distance) return '';
    if (distance < 1) {
      return `${Math.round(distance * 1000)} m`;
    }
    return `${distance.toFixed(1)} km`;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#16a34a" />
        <Text style={styles.loadingText}>Chargement de la carte...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Rechercher un point de collecte"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
          iconColor="#16a34a"
        />
      </View>

      <View style={styles.filtersContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={wasteTypes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Chip
              selected={activeFilters.includes(item.id)}
              onPress={() => toggleFilter(item.id)}
              style={[
                styles.filterChip,
                activeFilters.includes(item.id) && { backgroundColor: item.color + '20' }
              ]}
              textStyle={activeFilters.includes(item.id) ? { color: item.color } : {}}
            >
              {item.name}
            </Chip>
          )}
          ListHeaderComponent={
            activeFilters.length > 0 ? (
              <Chip
                onPress={() => setActiveFilters([])}
                style={styles.clearFiltersChip}
              >
                Effacer les filtres
              </Chip>
            ) : null
          }
        />
      </View>

      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={region}
          showsUserLocation
          showsMyLocationButton={false}
        >
          {filteredBins.map((bin) => (
            <Marker
              key={bin.id}
              coordinate={{
                latitude: bin.location.latitude,
                longitude: bin.location.longitude,
              }}
              title={bin.name}
              description={`Niveau de remplissage: ${bin.fillLevel}%`}
              onPress={() => handleMarkerPress(bin)}
              pinColor={selectedBin?.id === bin.id ? '#16a34a' : '#1f9bed'}
            />
          ))}
        </MapView>

        <View style={styles.mapControls}>
          <TouchableOpacity
            style={styles.mapButton}
            onPress={resetMap}
          >
            <Ionicons name="locate" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      {selectedBin && (
        <Card style={styles.binDetailCard}>
          <Card.Content>
            <View style={styles.binDetailHeader}>
              <View>
                <Text style={styles.binDetailTitle}>{selectedBin.name}</Text>
                <View style={styles.binDetailMeta}>
                  <View style={[
                    styles.fillLevelIndicator,
                    {
                      backgroundColor:
                        selectedBin.fillLevel < 50 ? '#22c55e' :
                        selectedBin.fillLevel < 80 ? '#f59e0b' : '#ef4444'
                    }
                  ]} />
                  <Text style={styles.binDetailMetaText}>
                    Niveau: {selectedBin.fillLevel}% • Capacité: {selectedBin.capacity}
                  </Text>
                </View>
              </View>
              {userLocation && (
                <Text style={styles.distanceText}>
                  {formatDistance(calculateDistance(
                    userLocation.latitude,
                    userLocation.longitude,
                    selectedBin.location.latitude,
                    selectedBin.location.longitude
                  ))}
                </Text>
              )}
            </View>

            <View style={styles.binTypes}>
              {selectedBin.types.map(typeId => {
                const type = wasteTypes.find(t => t.id === typeId);
                return type ? (
                  <Chip
                    key={typeId}
                    style={[styles.binTypeChip, { backgroundColor: type.color + '20' }]}
                    textStyle={{ color: type.color }}
                  >
                    {type.name}
                  </Chip>
                ) : null;
              })}
            </View>

            <View style={styles.binActions}>
              <Button
                mode="contained"
                onPress={navigateToBin}
                style={styles.directionButton}
                icon="directions"
              >
                Y aller
              </Button>
              <Button
                mode="outlined"
                onPress={() => setSelectedBin(null)}
                style={styles.closeButton}
              >
                Fermer
              </Button>
            </View>
          </Card.Content>
        </Card>
      )}
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
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  searchContainer: {
    padding: 8,
    backgroundColor: '#fff',
  },
  searchbar: {
    elevation: 2,
  },
  filtersContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  filterChip: {
    margin: 4,
  },
  clearFiltersChip: {
    margin: 4,
    backgroundColor: '#f3f4f6',
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  mapControls: {
    position: 'absolute',
    right: 16,
    bottom: 24,
  },
  mapButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  binDetailCard: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 16,
    elevation: 5,
  },
  binDetailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  binDetailTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  binDetailMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  fillLevelIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  binDetailMetaText: {
    fontSize: 12,
    color: '#666',
  },
  distanceText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#16a34a',
  },
  binTypes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    marginBottom: 8,
  },
  binTypeChip: {
    margin: 2,
  },
  binActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  directionButton: {
    flex: 1,
    marginRight: 8,
    backgroundColor: '#16a34a',
  },
  closeButton: {
    flex: 1,
  },
});
