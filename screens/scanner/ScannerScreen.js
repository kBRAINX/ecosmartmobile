import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ThemedText from '../../components/ThemedText';
import Button from '../../components/ui/Button';
import { useTheme } from '../../hooks/useTheme';
import Colors from '../../constants/Colors';

// Simulation de service d'API pour la détection de déchets
const mockDetectWaste = (imageUri) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simuler différents résultats en fonction du temps
      const types = ['plastic', 'paper', 'glass', 'metal', 'organic', 'mixed'];
      const randomIndex = Math.floor(Math.random() * types.length);
      const wasteType = types[randomIndex];

      resolve({
        type: wasteType,
        confidence: Math.floor(Math.random() * 30) + 70, // Génère un nombre entre 70 et 99
        recyclable: ['plastic', 'paper', 'glass', 'metal'].includes(wasteType),
        binColor: {
          plastic: 'yellow',
          paper: 'blue',
          glass: 'green',
          metal: 'grey',
          organic: 'brown',
          mixed: 'black'
        }[wasteType],
        tipText: {
          plastic: 'Assurez-vous de vider et rincer les contenants en plastique avant de les recycler.',
          paper: 'Le papier mouillé ou souillé ne peut pas être recyclé.',
          glass: 'Le verre peut être recyclé à l\'infini sans perdre de qualité.',
          metal: 'Les canettes en aluminium sont recyclables et économisent beaucoup d\'énergie.',
          organic: 'Les déchets organiques peuvent être compostés pour créer un engrais naturel.',
          mixed: 'Les déchets mixtes ne peuvent pas être recyclés facilement et finissent généralement en décharge.'
        }[wasteType]
      });
    }, 2000);
  });
};

export default function ScannerScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const [imageUri, setImageUri] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off);
  const [result, setResult] = useState(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');

      const imagePermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (imagePermission.status !== 'granted') {
        Alert.alert('Permission requise', 'Nous avons besoin de la permission d\'accéder à votre galerie.');
      }
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        setImageUri(photo.uri);
        analyzeImage(photo.uri);
      } catch (error) {
        console.error('Erreur lors de la prise de photo:', error);
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
        setImageUri(result.assets[0].uri);
        analyzeImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Erreur lors de la sélection d\'image:', error);
      Alert.alert('Erreur', 'Impossible de sélectionner une image. Veuillez réessayer.');
    }
  };

  const analyzeImage = async (uri) => {
    setIsAnalyzing(true);
    setResult(null);
    try {
      // Dans une application réelle, envoyer l'image à une API de détection
      const detectionResult = await mockDetectWaste(uri);
      setResult(detectionResult);

      // Ajouter des points à l'utilisateur (dans une vraie app, cela serait fait côté serveur)
      if (detectionResult.recyclable) {
        // Simuler l'ajout de points
        console.log('Points ajoutés: 10');
      }
    } catch (error) {
      console.error('Erreur lors de l\'analyse:', error);
      Alert.alert('Erreur', 'Impossible d\'analyser l\'image. Veuillez réessayer.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetScanner = () => {
    setImageUri(null);
    setResult(null);
    setIsAnalyzing(false);
  };

  const toggleCameraType = () => {
    setCameraType(
      cameraType === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };

  const toggleFlash = () => {
    setFlashMode(
      flashMode === Camera.Constants.FlashMode.off
        ? Camera.Constants.FlashMode.torch
        : Camera.Constants.FlashMode.off
    );
  };

  if (hasPermission === null) {
    return (
      <View style={styles.permissionContainer}>
        <ActivityIndicator size="large" color={Colors[theme].primary} />
        <ThemedText style={styles.permissionText}>Demande d'autorisation d'accès à la caméra...</ThemedText>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.permissionContainer}>
        <Ionicons name="camera-off-outline" size={64} color={Colors[theme].primary} />
        <ThemedText style={styles.permissionText}>
          L'accès à la caméra est nécessaire pour scanner les déchets.
        </ThemedText>
        <Button
          title="Demander l'autorisation"
          onPress={async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
          }}
          style={styles.permissionButton}
        />
      </View>
    );
  }

  if (imageUri && (isAnalyzing || result)) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={resetScanner} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={Colors[theme].text} />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>Résultat</ThemedText>
        </View>

        <View style={styles.resultContainer}>
          <Image source={{ uri: imageUri }} style={styles.capturedImage} />

          {isAnalyzing ? (
            <View style={styles.analyzingContainer}>
              <ActivityIndicator size="large" color={Colors[theme].primary} />
              <ThemedText style={styles.analyzingText}>Analyse en cours...</ThemedText>
            </View>
          ) : result ? (
            <View style={styles.resultInfoContainer}>
              <View style={[styles.resultTypeContainer, {
                backgroundColor: result.recyclable
                  ? 'rgba(40, 167, 69, 0.1)'
                  : 'rgba(220, 53, 69, 0.1)'
              }]}>
                <Ionicons
                  name={result.recyclable ? 'checkmark-circle' : 'close-circle'}
                  size={32}
                  color={result.recyclable ? Colors[theme].success : Colors[theme].error}
                />
                <View style={styles.resultTypeInfo}>
                  <ThemedText style={styles.resultTypeTitle}>
                    {result.type.charAt(0).toUpperCase() + result.type.slice(1)}
                  </ThemedText>
                  <ThemedText style={styles.resultTypeSubtitle}>
                    {result.recyclable ? 'Recyclable' : 'Non recyclable'} · {result.confidence}% de confiance
                  </ThemedText>
                </View>
              </View>

              <View style={styles.binInfoContainer}>
                <View style={[styles.binColorIndicator, { backgroundColor: result.binColor }]} />
                <ThemedText style={styles.binInfoText}>
                  À jeter dans la poubelle <ThemedText style={{ fontWeight: 'bold' }}>
                    {(() => {
                      switch(result.binColor) {
                        case 'yellow': return 'jaune';
                        case 'blue': return 'bleue';
                        case 'green': return 'verte';
                        case 'grey': return 'grise';
                        case 'brown': return 'marron';
                        case 'black': return 'noire';
                        default: return result.binColor;
                      }
                    })()}
                  </ThemedText>
                </ThemedText>
              </View>

              <View style={styles.tipContainer}>
                <Ionicons name="bulb-outline" size={24} color={Colors[theme].primary} />
                <ThemedText style={styles.tipText}>{result.tipText}</ThemedText>
              </View>

              <View style={styles.actionButtons}>
                <Button
                  title="Localiser une poubelle"
                  onPress={() => router.push('/map')}
                  style={styles.actionButton}
                />
                <Button
                  title="Scanner à nouveau"
                  onPress={resetScanner}
                  style={[styles.actionButton, { backgroundColor: '#6c757d' }]}
                />
              </View>

              {result.recyclable && (
                <View style={styles.pointsContainer}>
                  <ThemedText style={styles.pointsText}>
                    +10 points pour le recyclage !
                  </ThemedText>
                </View>
              )}
            </View>
          ) : null}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={styles.camera}
        type={cameraType}
        flashMode={flashMode}
      >
        <SafeAreaView style={styles.cameraContent}>
          <View style={styles.cameraHeader}>
            <ThemedText style={styles.headerTitle}>Scanner un déchet</ThemedText>
          </View>

          <View style={styles.cameraOverlay}>
            <View style={styles.scanFrame}>
              <View style={[styles.scanCorner, styles.topLeft]} />
              <View style={[styles.scanCorner, styles.topRight]} />
              <View style={[styles.scanCorner, styles.bottomLeft]} />
              <View style={[styles.scanCorner, styles.bottomRight]} />
            </View>

            <ThemedText style={styles.instructionText}>
              Placez l'objet au centre du cadre
            </ThemedText>
          </View>

          <View style={styles.cameraControls}>
            <TouchableOpacity style={styles.controlButton} onPress={toggleFlash}>
              <Ionicons
                name={flashMode === Camera.Constants.FlashMode.torch ? 'flash' : 'flash-off'}
                size={28}
                color="#fff"
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.controlButton} onPress={pickImage}>
              <Ionicons name="images" size={28} color="#fff" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionText: {
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
    fontSize: 16,
  },
  permissionButton: {
    minWidth: 200,
  },
  camera: {
    flex: 1,
  },
  cameraContent: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
  },
  cameraHeader: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  cameraOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 20,
    position: 'relative',
  },
  scanCorner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: '#fff',
    borderWidth: 4,
  },
  topLeft: {
    top: -2,
    left: -2,
    borderBottomWidth: 0,
    borderRightWidth: 0,
    borderTopLeftRadius: 16,
  },
  topRight: {
    top: -2,
    right: -2,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    borderTopRightRadius: 16,
  },
  bottomLeft: {
    bottom: -2,
    left: -2,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomLeftRadius: 16,
  },
  bottomRight: {
    bottom: -2,
    right: -2,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderBottomRightRadius: 16,
  },
  instructionText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  cameraControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 30,
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
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    marginRight: 16,
  },
  resultContainer: {
    flex: 1,
    padding: 16,
  },
  capturedImage: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    marginBottom: 20,
  },
  analyzingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  analyzingText: {
    marginTop: 10,
    fontSize: 16,
  },
  resultInfoContainer: {
    flex: 1,
  },
  resultTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  resultTypeInfo: {
    marginLeft: 16,
    flex: 1,
  },
  resultTypeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  resultTypeSubtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  binInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  binColorIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 10,
  },
  binInfoText: {
    fontSize: 16,
  },
  tipContainer: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  tipText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  actionButton: {
    flex: 0.48,
  },
  pointsContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  pointsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.success,
  },
});
