import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ThemedText from '../ThemedText';
import Button from '../ui/Button';
import { useTheme } from '../../hooks/useTheme';
import Colors from '../../constants/Colors';

const BinDetails = ({ bin, onClose, onGetDirections, isLoadingRoute }) => {
  const { theme } = useTheme();

  const getWasteTypeIcon = (type) => {
    switch (type) {
      case 'paper': return 'newspaper-outline';
      case 'plastic': return 'water-outline';
      case 'glass': return 'wine-outline';
      case 'metal': return 'hardware-chip-outline';
      case 'electronic': return 'phone-portrait-outline';
      case 'battery': return 'battery-charging-outline';
      case 'bulb': return 'bulb-outline';
      case 'organic': return 'leaf-outline';
      case 'general': return 'trash-outline';
      default: return 'help-circle-outline';
    }
  };

  const getBinTypeLabel = (type) => {
    switch (type) {
      case 'recycling': return 'Recyclage';
      case 'organic': return 'Compost';
      case 'general': return 'Ordures ménagères';
      case 'collection': return 'Point de collecte';
      default: return 'Autre';
    }
  };

  const getWasteTypeLabel = (type) => {
    switch (type) {
      case 'paper': return 'Papier';
      case 'plastic': return 'Plastique';
      case 'glass': return 'Verre';
      case 'metal': return 'Métal';
      case 'electronic': return 'Électronique';
      case 'battery': return 'Piles';
      case 'bulb': return 'Ampoules';
      case 'organic': return 'Organique';
      case 'general': return 'Général';
      default: return type;
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={onClose}
      >
        <Ionicons name="close" size={24} color={Colors[theme].text} />
      </TouchableOpacity>

      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <ThemedText style={styles.title}>{bin.title}</ThemedText>
          <View style={[styles.typeTag, {
            backgroundColor: (() => {
              switch (bin.type) {
                case 'recycling': return Colors[theme].primary;
                case 'organic': return '#8BC34A';
                case 'general': return '#9E9E9E';
                case 'collection': return '#FF9800';
                default: return Colors[theme].primary;
              }
            })()
          }]}>
            <ThemedText style={styles.typeText}>{getBinTypeLabel(bin.type)}</ThemedText>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.addressContainer}>
          <Ionicons name="location-outline" size={20} color={Colors[theme].primary} />
          <ThemedText style={styles.address}>{bin.address}</ThemedText>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Ionicons name="time-outline" size={20} color={Colors[theme].text} />
            <ThemedText style={styles.infoText}>
              Vidée le {new Date(bin.lastEmptied).toLocaleDateString()}
            </ThemedText>
          </View>
          <View style={styles.infoItem}>
            <Ionicons
              name={bin.isFull ? "alert-circle-outline" : "checkmark-circle-outline"}
              size={20}
              color={bin.isFull ? Colors[theme].error : Colors[theme].success}
            />
            <ThemedText style={[styles.infoText, {
              color: bin.isFull ? Colors[theme].error : Colors[theme].success
            }]}>
              {bin.isFull ? 'Pleine' : 'Disponible'}
            </ThemedText>
          </View>
        </View>

        {bin.photoUrl && (
          <Image source={{ uri: bin.photoUrl }} style={styles.image} />
        )}

        <View style={styles.wasteTypesContainer}>
          <ThemedText style={styles.sectionTitle}>Types de déchets acceptés</ThemedText>
          <View style={styles.wasteTypesList}>
            {bin.wasteTypes.map((type, index) => (
              <View key={index} style={styles.wasteTypeItem}>
                <Ionicons name={getWasteTypeIcon(type)} size={20} color={Colors[theme].primary} />
                <ThemedText style={styles.wasteTypeText}>{getWasteTypeLabel(type)}</ThemedText>
              </View>
            ))}
          </View>
        </View>

        <Button
          title={isLoadingRoute ? "Chargement de l'itinéraire..." : "Obtenir l'itinéraire"}
          onPress={onGetDirections}
          disabled={isLoadingRoute}
          style={styles.directionsButton}
          icon={isLoadingRoute ? null : "navigate-outline"}
        >
          {isLoadingRoute && <ActivityIndicator size="small" color="#fff" style={{marginRight: 8}} />}
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    maxHeight: '60%',
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
    padding: 4,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 24, // Espace pour le bouton fermer
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  typeTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 8,
  },
  typeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  address: {
    marginLeft: 8,
    fontSize: 14,
    flex: 1,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    marginLeft: 4,
    fontSize: 14,
  },
  image: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 16,
  },
  wasteTypesContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  wasteTypesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  wasteTypeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  wasteTypeText: {
    marginLeft: 4,
    fontSize: 12,
  },
  directionsButton: {
    marginTop: 8,
  },
});

export default BinDetails;
