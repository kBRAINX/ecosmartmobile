import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Camera } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/theme';

export default function CameraScanner({ onCapture, onError }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [scanning, setScanning] = useState(false);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
      if (status !== 'granted') {
        onError && onError('Camera permission not granted');
      }
    })();
  }, []);

  const handleCapture = async () => {
    if (cameraRef.current && cameraReady) {
      setScanning(true);
      try {
        const photo = await cameraRef.current.takePictureAsync();
        setScanning(false);
        onCapture && onCapture(photo.uri);
      } catch (error) {
        setScanning(false);
        console.error('Error taking picture:', error);
        onError && onError('Failed to take picture');
      }
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.text}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Ionicons name="camera-off-outline" size={48} color="#ef4444" />
        <Text style={styles.errorText}>No access to camera</Text>
        <Text style={styles.subText}>Please enable camera access in your device settings</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={styles.camera}
        type={Camera.Constants.Type.back}
        onCameraReady={() => setCameraReady(true)}
        ratio="16:9"
      >
        <View style={styles.overlay}>
          <View style={styles.scanFrame}>
            {scanning && (
              <View style={styles.scanningOverlay}>
                <ActivityIndicator size="large" color="#fff" />
                <Text style={styles.scanningText}>Scanning...</Text>
              </View>
            )}
          </View>
        </View>
      </Camera>

      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.captureButton}
          onPress={handleCapture}
          disabled={scanning || !cameraReady}
        >
          <View style={[styles.captureButtonInner, scanning && styles.captureButtonDisabled]} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanningOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  scanningText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  },
  controls: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
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
  captureButtonDisabled: {
    opacity: 0.5,
  },
  text: {
    color: '#fff',
    marginTop: 10,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 12,
  },
  subText: {
    color: '#fff',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 24,
  },
});
