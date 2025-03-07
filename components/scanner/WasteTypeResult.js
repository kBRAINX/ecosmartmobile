// components/scanner/WasteTypeResult.js
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from '../ui/Button';

export default function WasteTypeResult({ result, onReset, onViewOnMap }) {
  if (!result) return null;

  const { wasteType, confidence, nearestBin, imageUri } = result;

  return (
    <View style={styles.container}>
      {imageUri && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUri }} style={styles.image} />
        </View>
      )}

      <View style={styles.resultContainer}>
        <View style={styles.typeHeader}>
          <View style={[styles.typeIcon, { backgroundColor: `${wasteType.color}20` }]}>
            <Image source={{ uri: wasteType.icon }} style={styles.icon} resizeMode="contain" />
          </View>
          <View style={styles.typeInfo}>
            <Text style={styles.typeName}>{wasteType.name}</Text>
            <Text style={styles.confidence}>Confidence: {confidence.toFixed(1)}%</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description:</Text>
          <Text style={styles.sectionText}>{wasteType.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recyclage:</Text>
          <Text style={styles.sectionText}>{wasteType.recyclingInfo}</Text>
        </View>

        <View style={[styles.section, styles.pointsSection]}>
          <Text style={styles.pointsTitle}>Points:</Text>
          <Text style={styles.pointsValue}>{wasteType.pointsPerKg} points par kg</Text>
        </View>

        {nearestBin && (
          <View style={styles.binContainer}>
            <View style={styles.binHeader}>
              <Ionicons name="location" size={20} color="#16a34a" />
              <Text style={styles.binTitle}>Point de collecte le plus proche</Text>
            </View>

            <Text style={styles.binName}>{nearestBin.name}</Text>
            <Text style={styles.binInfo}>
              Capacité: {nearestBin.capacity} • Niveau: {nearestBin.fillLevel}%
            </Text>

            <Button
              title="Voir sur la carte"
              onPress={onViewOnMap}
              style={styles.mapButton}
            />
          </View>
        )}

        <TouchableOpacity style={styles.resetButton} onPress={onReset}>
          <Text style={styles.resetText}>Scanner à nouveau</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  resultContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  typeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  typeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: {
    width: 24,
    height: 24,
  },
  typeInfo: {
    flex: 1,
  },
  typeName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  confidence: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  sectionText: {
    color: '#444',
  },
  pointsSection: {
    backgroundColor: '#e6f7ee',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  pointsTitle: {
    fontWeight: 'bold',
    color: '#16a34a',
  },
  pointsValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#16a34a',
    marginTop: 4,
  },
  binContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  binHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  binTitle: {
    fontWeight: 'bold',
    marginLeft: 8,
  },
  binName: {
    fontSize: 16,
    marginBottom: 4,
  },
  binInfo: {
    fontSize: 12,
    color: '#666',
    marginBottom: 12,
  },
  mapButton: {
    marginTop: 8,
  },
  resetButton: {
    padding: 12,
    alignItems: 'center',
  },
  resetText: {
    color: '#16a34a',
    fontWeight: '500',
  },
});
