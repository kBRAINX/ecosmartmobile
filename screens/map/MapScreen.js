import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import ThemedText from '../../components/ThemedText';
import BinDetails from '../../components/maps/BinDetails';
import { useTheme } from '../../hooks/useTheme';
import Colors from '../../constants/Colors';

// Données fictives pour les poubelles
const MOCK_BINS = [
  {
    id: '1',
    coordinate: { latitude: 48.8566, longitude: 2.3522 }, // Paris
    title: 'Poubelle recyclage',
    type: 'recycling',
    wasteTypes: ['paper', 'plastic', 'glass'],
    address: '123 Rue de Rivoli, 75001 Paris',
    lastEmptied: '2025-03-05',
    isFull: false,
    photoUrl: 'https://via.placeholder.com/150'
  },
  {
    id: '2',
    coordinate: { latitude: 48.8606, longitude: 2.3376 }, // Un peu à l'ouest
    title: 'Poubelle générale',
    type: 'general',
    wasteTypes: ['general'],
    address: '45 Avenue de l\'Opéra, 75002 Paris',
    lastEmptied: '2025-03-06',
    isFull: true,
    photoUrl: 'https://via.placeholder.com/150'
  },
  {
    id: '3',
    coordinate: { latitude: 48.8530, longitude: 2.3499 }, // Un peu au sud
    title: 'Poubelle compost',
    type: 'organic',
    wasteTypes: ['organic'],
    address: '10 Boulevard Saint-Germain, 75005 Paris',
    lastEmptied: '2025-03-04',
    isFull: false,
    photoUrl: 'https://via.placeholder.com/150'
  },
  {
    id: '4',
    coordinate: { latitude: 48.8615, longitude: 2.3649 }, // Un peu à l'est
    title: 'Point de collecte',
    type: 'collection',
    wasteTypes: ['electronic', 'battery', 'bulb'],
    address: '22 Rue de Turbigo, 75003 Paris',
    lastEmptied: '2025-03-03',
    isFull: false,
    photoUrl: 'https://via.placeholder.com/150'
  }
];

// Simulation d'API pour calculer un itinéraire
const mockCalculateRoute = (startCoord, endCoord) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Générer des points de route simplifiés entre startCoord et endCoord
      const steps = 8; // Nombre de points intermédiaires
      const route = [];

      for (let i = 0; i <= steps; i++) {
        const ratio = i / steps;

        // Interpolation linéaire (drôle de chemin, mais ça fera l'affaire pour la démo)
        // Dans un cas réel, cela viendrait d'une API comme Google Directions
        const lat = startCoord.latitude + (endCoord.latitude - startCoord.latitude) * ratio;
        const lng = startCoord.longitude + (endCoord.longitude - startCoord.longitude) * ratio;

        // Ajouter un peu de variation aléatoire pour simuler une route plus réaliste
        const jitter = i > 0 && i < steps ? (Math.random() - 0.5) * 0.001 : 0;

        route.push({
          latitude: lat + jitter,
          longitude: lng + jitter
        });
      }

      // Ajouter des metadata
      resolve({
        points: route,
        distance: Math.round(calculateDistance(startCoord, endCoord) * 1000), // en mètres
        duration: Math.round(calculateDistance(startCoord, endCoord) * 1000 / 5) // ~ 5 m/s, en secondes
      });
    }, 1000);
  });
};

// Calcul de distance simple entre deux coordonnées (formule de Haversine)
const calculateDistance = (coord1, coord2) => {
  const R = 6371; // Rayon de la Terre en km
  const dLat = (coord2.latitude - coord1.latitude) * Math.PI / 180;
  const dLon = (coord2.longitude - coord1.longitude) * Math.PI / 180;
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(coord1.latitude * Math.PI / 180) * Math.cos(coord2.latitude * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance en km
};

export default function MapScreen() {
  const { theme } = useTheme();
  const [userLocation, setUserLocation] = useState(null);
  const [selectedBin, setSelectedBin] = useState(null);
  const [bins, setBins] = useState([]);
  const [isLocationLoading, setIsLocationLoading] = useState(true);
  const [isRouteVisible, setIsRouteVisible] = useState(false);
  const [routeInfo, setRouteInfo] = useState(null);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  const mapRef = useRef(null);

  useEffect(() => {
    (async () => {
      // Demander les permissions de localisation
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Permission refusée',
          'L\'accès à la localisation est nécessaire pour afficher votre position sur la carte.',
          [{ text: 'OK' }]
        );
        setIsLocationLoading(false);
        return;
      }

      try {
        // Obtenir la position de l'utilisateur
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        // Charger les poubelles proches de l'utilisateur
        // Dans une app réelle, cet appel serait fait à une API avec la position actuelle
        // pour obtenir les poubelles à proximité
        loadNearbyBins(location.coords);
      } catch (error) {
        console.error('Erreur lors de l\'obtention de la position:', error);
        Alert.alert(
          'Erreur de localisation',
          'Impossible d\'obtenir votre position actuelle. Veuillez vérifier vos paramètres de localisation.',
          [{ text: 'OK' }]
        );
      } finally {
        setIsLocationLoading(false);
      }
    })();
  }, []);

  const loadNearbyBins = (location) => {
    // Simuler un appel API pour charger les poubelles à proximité
    // Ajuster les coordonnées des poubelles fictives pour être proches de l'utilisateur
    const adjustedBins = MOCK_BINS.map(bin => {
      // Ajuster les coordonnées pour être à une distance raisonnable de l'utilisateur
      // Cela simule des poubelles à proximité de l'utilisateur
      const offsetLat = (Math.random() - 0.5) * 0.01; // ~1km max
      const offsetLng = (Math.random() - 0.5) * 0.01;

      return {
        ...bin,
        coordinate: {
          latitude: location.latitude + offsetLat,
          longitude: location.longitude + offsetLng
        }
      };
    });

    setBins(adjustedBins);
  };

  const handleBinPress = (bin) => {
    setSelectedBin(bin);
    setIsRouteVisible(false);
    setRouteInfo(null);

    // Centrer la carte sur la poubelle sélectionnée
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: bin.coordinate.latitude,
        longitude: bin.coordinate.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }, 500);
    }
  };

  const handleCloseDetails = () => {
    setSelectedBin(null);
    setIsRouteVisible(false);
    setRouteInfo(null);
  };

  const handleShowRoute = async () => {
    if (!userLocation || !selectedBin) return;

    setIsLoadingRoute(true);

    try {
      const result = await mockCalculateRoute(userLocation, selectedBin.coordinate);
      setRouteInfo(result);
      setIsRouteVisible(true);

      // Ajuster la zone visible pour montrer tout l'itinéraire
      if (mapRef.current) {
        mapRef.current.fitToCoordinates(
          [userLocation, selectedBin.coordinate],
          {
            edgePadding: { top: 100, right: 50, bottom: 300, left: 50 },
            animated: true,
          }
        );
      }
    } catch (error) {
      console.error('Erreur lors du calcul de l\'itinéraire:', error);
      Alert.alert(
        'Erreur',
        'Impossible de calculer l\'itinéraire. Veuillez réessayer.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoadingRoute(false);
    }
  };

  const centerOnUser = () => {
    if (userLocation && mapRef.current) {
      mapRef.current.animateToRegion({
        ...userLocation,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 500);
    }
  };

  const refreshUserLocation = async () => {
    setIsLocationLoading(true);
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      // Recharger les poubelles proches
      loadNearbyBins(location.coords);

      // Centrer la carte sur la nouvelle position
      centerOnUser();
    } catch (error) {
      console.error('Erreur lors de l\'actualisation de la position:', error);
      Alert.alert(
        'Erreur',
        'Impossible d\'actualiser votre position. Veuillez réessayer.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLocationLoading(false);
    }
  };

  // Fonction pour formater la durée en minutes et secondes
  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes} min ${remainingSeconds} sec`;
  };

  // Fonction pour formater la distance
  const formatDistance = (meters) => {
    if (meters < 1000) {
      return `${meters} m`;
    } else {
      return `${(meters / 1000).toFixed(1)} km`;
    }
  };

  const getBinMarkerColor = (binType) => {
    switch (binType) {
      case 'recycling': return Colors[theme].primary;
      case 'organic': return '#8BC34A';
      case 'general': return '#9E9E9E';
      case 'collection': return '#FF9800';
      default: return Colors[theme].primary;
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        showsUserLocation
        showsMyLocationButton={false}
        initialRegion={
          userLocation ? {
            ...userLocation,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          } : {
            // Position par défaut (Paris) si la position de l'utilisateur n'est pas disponible
            latitude: 48.8566,
            longitude: 2.3522,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }
        }
      >
        {bins.map(bin => (
          <Marker
            key={bin.id}
            coordinate={bin.coordinate}
            title={bin.title}
            onPress={() => handleBinPress(bin)}
          >
            <View style={[styles.binMarker, { backgroundColor: getBinMarkerColor(bin.type) }]}>
              <Ionicons
                name={
                  bin.type === 'recycling' ? 'trash-outline' :
                  bin.type === 'organic' ? 'leaf-outline' :
                  bin.type === 'collection' ? 'cube-outline' : 'trash-outline'
                }
                size={16}
                color="#fff"
              />
            </View>
          </Marker>
        ))}

        {isRouteVisible && routeInfo && (
          <Polyline
            coordinates={routeInfo.points}
            strokeWidth={4}
            strokeColor={Colors[theme].primary}
          />
        )}
      </MapView>

      <SafeAreaView style={styles.overlay}>
        <View style={styles.header}>
          <ThemedText style={styles.headerTitle}>Carte des poubelles</ThemedText>
        </View>

        <View style={styles.controls}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={centerOnUser}
            disabled={isLocationLoading}
          >
            <Ionicons name="locate" size={24} color={Colors[theme].primary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.controlButton}
            onPress={refreshUserLocation}
            disabled={isLocationLoading}
          >
            <Ionicons name="refresh" size={24} color={Colors[theme].primary} />
          </TouchableOpacity>
        </View>

        {isLocationLoading && (
          <View style={styles.loadingOverlay}>
            <View style={styles.loadingContainer}>
              <Ionicons name="locate" size={24} color={Colors[theme].primary} />
              <ThemedText style={styles.loadingText}>Localisation en cours...</ThemedText>
            </View>
          </View>
        )}

        {selectedBin && (
          <View style={styles.detailsContainer}>
            <BinDetails
              bin={selectedBin}
              onClose={handleCloseDetails}
              onGetDirections={handleShowRoute}
              isLoadingRoute={isLoadingRoute}
            />

            {isRouteVisible && routeInfo && (
              <View style={styles.routeInfoContainer}>
                <View style={styles.routeInfoHeader}>
                  <Ionicons name="navigate" size={20} color={Colors[theme].primary} />
                  <ThemedText style={styles.routeInfoTitle}>Itinéraire</ThemedText>
                </View>

                <View style={styles.routeInfoDetails}>
                  <View style={styles.routeInfoItem}>
                    <Ionicons name="time-outline" size={16} color={Colors[theme].text} />
                    <ThemedText style={styles.routeInfoText}>
                      {formatDuration(routeInfo.duration)}
                    </ThemedText>
                  </View>

                  <View style={styles.routeInfoItem}>
                    <Ionicons name="resize-outline" size={16} color={Colors[theme].text} />
                    <ThemedText style={styles.routeInfoText}>
                      {formatDistance(routeInfo.distance)}
                    </ThemedText>
                  </View>
                </View>
              </View>
            )}
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
  },
  header: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  controls: {
    position: 'absolute',
    right: 16,
    top: 80,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  controlButton: {
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  binMarker: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  detailsContainer: {
    marginTop: 'auto',
    width: '100%',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  loadingContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
  },
  routeInfoContainer: {
    backgroundColor: 'white',
    padding: 12,
    margin: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  routeInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  routeInfoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  routeInfoDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  routeInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  routeInfoText: {
    marginLeft: 4,
    fontSize: 14,
  },
});
