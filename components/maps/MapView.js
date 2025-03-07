import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Dimensions } from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/theme';
import Badge from '../ui/Badge';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.02;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default function CustomMapView({
  bins = [],
  userLocation,
  selectedBin,
  onBinSelect,
  onUserLocationPress,
  wasteTypes = [],
  style,
}) {
  const [region, setRegion] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (userLocation) {
      setRegion({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      });
    } else if (bins.length > 0) {
      // Default to first bin if no user location
      setRegion({
        latitude: bins[0].location.latitude,
        longitude: bins[0].location.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      });
    }
  }, [userLocation, bins]);

  useEffect(() => {
    if (selectedBin && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: selectedBin.location.latitude,
        longitude: selectedBin.location.longitude,
        latitudeDelta: LATITUDE_DELTA / 2,
        longitudeDelta: LONGITUDE_DELTA / 2,
      });
    }
  }, [selectedBin]);

  const navigateToUserLocation = () => {
    if (userLocation && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      });
    }
    onUserLocationPress && onUserLocationPress();
  };

  if (!region) {
    return (
      <View style={[styles.container, style]}>
        <Text style={styles.loadingText}>Loading map...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={region}
        showsUserLocation
        showsMyLocationButton={false}
      >
        {bins.map((bin) => (
          <Marker
            key={bin.id}
            coordinate={{
              latitude: bin.location.latitude,
              longitude: bin.location.longitude,
            }}
            title={bin.name}
            description={`Fill level: ${bin.fillLevel}%`}
            pinColor={selectedBin?.id === bin.id ? colors.primary : '#1f9bed'}
            onPress={() => onBinSelect && onBinSelect(bin)}
          >
            <Callout>
              <View style={styles.callout}>
                <Text style={styles.calloutTitle}>{bin.name}</Text>
                <Text>Fill level: {bin.fillLevel}%</Text>
                <View style={styles.calloutTypes}>
                  {bin.types.map(typeId => {
                    const type = wasteTypes.find(t => t.id === typeId);
                    return type ? (
                      <Badge
                        key={typeId}
                        label={type.name}
                        color={type.color}
                        size="small"
                        style={styles.calloutBadge}
                      />
                    ) : null;
                  })}
                </View>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={navigateToUserLocation}
        >
          <Ionicons name="locate" size={24} color="#333" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
  controls: {
    position: 'absolute',
    right: 16,
    bottom: 24,
  },
  controlButton: {
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
  callout: {
    width: 150,
    padding: 8,
  },
  calloutTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  calloutTypes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  calloutBadge: {
    margin: 2,
  },
});
