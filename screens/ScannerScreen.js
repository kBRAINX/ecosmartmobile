// app/screens/ScannerScreen.js
import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card } from 'react-native-paper';
import mockData from '../constants/mockData';

export default function ScannerScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const takePhoto = async () => {
    if (cameraRef.current && cameraReady) {
      setIsScanning(true);
      try {
        const photo = await cameraRef.current.takePictureAsync();
        processScan(photo.uri);
      } catch (error) {
        console.error('Error taking picture:', error);
        setIsScanning(false);
        Alert.alert('Erreur', 'Impossible de prendre une photo. Veuillez réessayer.');
      }
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setIsScanning(true);
        processScan(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Erreur', 'Impossible de sélectionner une image.');
    }
  };

  const processScan = async (imageUri) => {
    // Simuler l'analyse de l'image et la détection du type de déchet
    setTimeout(() => {
      // Générer un résultat aléatoire
      const randomIndex = Math.floor(Math.random() * mockData.wasteTypes.length);
      const detectedWaste = mockData.wasteTypes[randomIndex];
      const confidence = Math.random() * 30 + 70; // Entre 70 et 100

      // Trouver une poubelle proche
      const nearestBin = mockData.wasteBins.find(bin => bin.types.includes(detectedWaste.id));

      setScanResult({
        wasteType: detectedWaste,
        imageUri,
        confidence,
        nearestBin,
      });
      setIsScanning(false);
    }, 2000);
  };

  const resetScan = () => {
    setScanResult(null);
  };

  if (hasPermission === null) {
    return <View style={styles.container}><Text>Demande de permission...</Text></View>;
  }
  if (hasPermission === false) {
    return <View style={styles.container}><Text>Pas d'accès à la caméra</Text></View>;
  }

  if (scanResult) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.resultContainer}>
          <Card style={styles.resultCard}>
            <Card.Title title="Résultat de l'analyse" />
            <Card.Content>
              <View style={styles.resultImageContainer}>
                <Image source={{ uri: scanResult.imageUri }} style={styles.resultImage} />
              </View>

              <View style={styles.wasteInfoContainer}>
                <View style={[styles.wasteIconContainer, { backgroundColor: `${scanResult.wasteType.color}20` }]}>
                  <Image
                    source={{ uri: scanResult.wasteType.icon }}
                    style={styles.wasteIcon}
                  />
                </View>
                <View style={styles.wasteDetails}>
                  <Text style={styles.wasteTitle}>{scanResult.wasteType.name}</Text>
                  <Text style={styles.confidenceText}>Confiance: {scanResult.confidence.toFixed(1)}%</Text>
                </View>
              </View>

              <View style={styles.infoSection}>
                <Text style={styles.infoTitle}>Description:</Text>
                <Text style={styles.infoText}>{scanResult.wasteType.description}</Text>
              </View>

              <View style={styles.infoSection}>
                <Text style={styles.infoTitle}>Recyclage:</Text>
                <Text style={styles.infoText}>{scanResult.wasteType.recyclingInfo}</Text>
              </View>

              <View style={styles.pointsContainer}>
                <Text style={styles.pointsTitle}>Points:</Text>
                <Text style={styles.pointsValue}>{scanResult.wasteType.pointsPerKg} points par kg</Text>
              </View>

              {scanResult.nearestBin && (
                <Card style={styles.binCard}>
                  <Card.Content>
                    <View style={styles.binHeader}>
                      <Ionicons name="map-marker" size={20} color="#16a34a" />
                      <Text style={styles.binTitle}>Point de collecte le plus proche</Text>
                    </View>
                    <Text style={styles.binName}>{scanResult.nearestBin.name}</Text>
                    <Text style={styles.binInfo}>
                      Capacité: {scanResult.nearestBin.capacity} •
                      Niveau de remplissage: {scanResult.nearestBin.fillLevel}%
                    </Text>
                  </Card.Content>
                </Card>
              )}
            </Card.Content>

            <Card.Actions style={styles.resultActions}>
              <Button
                mode="outlined"
                onPress={resetScan}
                style={styles.resetButton}
              >
                Scanner à nouveau
              </Button>
              <Button
                mode="contained"
                onPress={() => {} /* Navigation vers la carte */}
                style={styles.mapButton}
              >
                Voir sur la carte
              </Button>
            </Card.Actions>
          </Card>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={styles.camera}
        type={Camera.Constants.Type.back}
        onCameraReady={() => setCameraReady(true)}
      >
        <View style={styles.scanFrame}>
          {/* Cadre de numérisation */}
        </View>

        {isScanning && (
          <View style={styles.scanningOverlay}>
            <ActivityIndicator size="large" color="#16a34a" />
            <Text style={styles.scanningText}>Analyse en cours...</Text>
          </View>
        )}
      </Camera>

      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.galleryButton}
          onPress={pickImage}
          disabled={isScanning}
        >
          <Ionicons name="images-outline" size={28} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.captureButton}
          onPress={takePhoto}
          disabled={isScanning || !cameraReady}
        >
          <View style={styles.captureButtonInner} />
        </TouchableOpacity>

        <View style={styles.placeholder} />
      </View>

      <View style={styles.guide}>
        <Text style={styles.guideTitle}>Comment scanner</Text>
        <Text style={styles.guideText}>
          Positionnez votre déchet dans le cadre et prenez une photo, ou sélectionnez une image de votre galerie.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#000',
    },
    camera: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    scanFrame: {
      width: 250,
      height: 250,
      borderWidth: 2,
      borderColor: '#fff',
      borderStyle: 'dashed',
      borderRadius: 10,
    },
    controls: {
      position: 'absolute',
      bottom: 30,
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      paddingHorizontal: 30,
    },
    galleryButton: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    captureButton: {
      width: 70,
      height: 70,
      borderRadius: 35,
      backgroundColor: 'rgba(255, 255, 255, 0.3)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    captureButtonInner: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: '#fff',
    },
    placeholder: {
      width: 50,
    },
    guide: {
      position: 'absolute',
      top: 50,
      left: 20,
      right: 20,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      padding: 15,
      borderRadius: 10,
    },
    guideTitle: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    guideText: {
      color: '#fff',
      fontSize: 14,
    },
    scanningOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    scanningText: {
      color: '#fff',
      marginTop: 10,
      fontSize: 16,
    },
    resultContainer: {
      flex: 1,
      padding: 16,
      backgroundColor: '#f5f5f5',
    },
    resultCard: {
      flex: 1,
      marginBottom: 16,
    },
    resultImageContainer: {
      width: '100%',
      height: 200,
      marginBottom: 16,
      borderRadius: 8,
      overflow: 'hidden',
    },
    resultImage: {
      width: '100%',
      height: '100%',
    },
    wasteInfoContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    wasteIconContainer: {
      width: 50,
      height: 50,
      borderRadius: 25,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    wasteIcon: {
      width: 30,
      height: 30,
    },
    wasteDetails: {
      flex: 1,
    },
    wasteTitle: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    confidenceText: {
      fontSize: 14,
      color: '#666',
    },
    infoSection: {
      marginBottom: 12,
    },
    infoTitle: {
      fontWeight: 'bold',
      marginBottom: 4,
    },
    infoText: {
      color: '#444',
    },
    pointsContainer: {
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
    binCard: {
      marginTop: 8,
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
    },
    resultActions: {
      justifyContent: 'space-between',
      paddingHorizontal: 8,
    },
    resetButton: {
      flex: 1,
      marginRight: 8,
    },
    mapButton: {
      flex: 1,
      backgroundColor: '#16a34a',
    },
  });
