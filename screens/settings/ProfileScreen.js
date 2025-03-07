import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar, Button, Card, TextInput, Switch, Divider } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import mockData from '../../constants/mockData';

export default function ProfileScreen() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // État du formulaire de profil
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    language: 'fr',
    darkMode: false,
    notifications: true
  });

  useEffect(() => {
    // Charger les données de l'utilisateur
    setTimeout(() => {
      const userData = mockData.users[0];
      setUser(userData);
      setFormData({
        name: userData.name,
        email: userData.email,
        phone: '655 123 456', // Exemple
        language: userData.preferences.language,
        darkMode: userData.preferences.darkMode,
        notifications: userData.preferences.notifications
      });
      setIsLoading(false);
    }, 500);
  }, []);

  const toggleEdit = () => {
    if (isEditing) {
      // Annuler les modifications
      setFormData({
        name: user.name,
        email: user.email,
        phone: '655 123 456',
        language: user.preferences.language,
        darkMode: user.preferences.darkMode,
        notifications: user.preferences.notifications
      });
    }
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    setIsLoading(true);

    // Simuler un appel API pour mise à jour
    setTimeout(() => {
      // Mettre à jour l'utilisateur
      setUser(prev => ({
        ...prev,
        name: formData.name,
        email: formData.email,
        preferences: {
          ...prev.preferences,
          language: formData.language,
          darkMode: formData.darkMode,
          notifications: formData.notifications
        }
      }));

      setIsLoading(false);
      setIsEditing(false);
      Alert.alert('Succès', 'Profil mis à jour avec succès !');
    }, 1000);
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission refusée', 'Nous avons besoin de la permission pour accéder à vos photos.');
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        // Mise à jour de l'avatar
        setUser(prev => ({
          ...prev,
          avatarUrl: result.assets[0].uri
        }));
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Erreur', 'Impossible de sélectionner une image.');
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Supprimer le compte",
      "Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.",
      [
        {
          text: "Annuler",
          style: "cancel"
        },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => console.log("Delete account")
        }
      ]
    );
  };

  if (isLoading || !user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#16a34a" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Avatar.Image
              source={{ uri: user.avatarUrl }}
              size={100}
            />
            <TouchableOpacity
              style={styles.avatarEditButton}
              onPress={pickImage}
            >
              <Ionicons name="camera" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          <Text style={styles.userJoined}>Membre depuis {new Date(user.joinedDate).toLocaleDateString()}</Text>
        </View>

        <Card style={styles.infoCard}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Informations personnelles</Text>
              <Button
                mode="text"
                onPress={toggleEdit}
                style={styles.editButton}
                labelStyle={styles.editButtonLabel}
              >
                {isEditing ? "Annuler" : "Modifier"}
              </Button>
            </View>

            {isEditing ? (
              <View style={styles.formContainer}>
                <TextInput
                  label="Nom complet"
                  value={formData.name}
                  onChangeText={(text) => setFormData({ ...formData, name: text })}
                  style={styles.input}
                  mode="outlined"
                  outlineColor="#ddd"
                  activeOutlineColor="#16a34a"
                />

                <TextInput
                  label="Email"
                  value={formData.email}
                  onChangeText={(text) => setFormData({ ...formData, email: text })}
                  keyboardType="email-address"
                  style={styles.input}
                  mode="outlined"
                  outlineColor="#ddd"
                  activeOutlineColor="#16a34a"
                />

                <TextInput
                  label="Téléphone"
                  value={formData.phone}
                  onChangeText={(text) => setFormData({ ...formData, phone: text })}
                  keyboardType="phone-pad"
                  style={styles.input}
                  mode="outlined"
                  outlineColor="#ddd"
                  activeOutlineColor="#16a34a"
                />

                <Divider style={styles.divider} />

                <Text style={styles.preferencesTitle}>Préférences</Text>

                <View style={styles.switchItem}>
                  <Text>Mode sombre</Text>
                  <Switch
                    value={formData.darkMode}
                    onValueChange={(value) => setFormData({ ...formData, darkMode: value })}
                    color="#16a34a"
                  />
                </View>

                <View style={styles.switchItem}>
                  <Text>Notifications</Text>
                  <Switch
                    value={formData.notifications}
                    onValueChange={(value) => setFormData({ ...formData, notifications: value })}
                    color="#16a34a"
                  />
                </View>

                <Button
                  mode="contained"
                  onPress={handleSave}
                  style={styles.saveButton}
                  loading={isLoading}
                >
                  Enregistrer
                </Button>
              </View>
            ) : (
              <View style={styles.infoContainer}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Nom</Text>
                  <Text style={styles.infoValue}>{user.name}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Email</Text>
                  <Text style={styles.infoValue}>{user.email}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Téléphone</Text>
                  <Text style={styles.infoValue}>655 123 456</Text>
                </View>

                <Divider style={styles.divider} />

                <Text style={styles.preferencesTitle}>Préférences</Text>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Mode sombre</Text>
                  <Text style={[
                    styles.statusBadge,
                    user.preferences.darkMode ? styles.activeStatus : styles.inactiveStatus
                  ]}>
                    {user.preferences.darkMode ? "Activé" : "Désactivé"}
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Notifications</Text>
                  <Text style={[
                    styles.statusBadge,
                    user.preferences.notifications ? styles.activeStatus : styles.inactiveStatus
                  ]}>
                    {user.preferences.notifications ? "Activées" : "Désactivées"}
                  </Text>
                </View>
              </View>
            )}
          </Card.Content>
        </Card>

        <Card style={styles.infoCard}>
          <Card.Content>
            <Text style={styles.cardTitle}>Sécurité</Text>

            <Button
              mode="text"
              onPress={() => {}}
              icon="lock-outline"
              style={styles.securityButton}
            >
              Modifier le mot de passe
            </Button>

            <Divider style={styles.divider} />

            <Button
              mode="text"
              onPress={handleDeleteAccount}
              icon="delete-outline"
              style={styles.deleteButton}
              labelStyle={styles.deleteButtonLabel}
            >
              Supprimer mon compte
            </Button>
          </Card.Content>
        </Card>

        <Button
          mode="outlined"
          onPress={() => {}}
          icon="logout"
          style={styles.logoutButton}
        >
          Se déconnecter
        </Button>
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
  scrollContent: {
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  avatarEditButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#16a34a',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  userEmail: {
    color: '#666',
    marginBottom: 4,
  },
  userJoined: {
    color: '#888',
    fontSize: 12,
  },
  infoCard: {
    marginBottom: 16,
    borderRadius: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  editButton: {
    margin: 0,
  },
  editButtonLabel: {
    color: '#16a34a',
    marginVertical: 0,
  },
  formContainer: {
    marginTop: 8,
  },
  input: {
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  divider: {
    marginVertical: 16,
  },
  preferencesTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
  },
  switchItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  saveButton: {
    marginTop: 16,
    backgroundColor: '#16a34a',
  },
  infoContainer: {
    marginTop: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoLabel: {
    color: '#666',
  },
  infoValue: {
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    overflow: 'hidden',
    fontSize: 12,
  },
  activeStatus: {
    backgroundColor: '#dcfce7',
    color: '#16a34a',
  },
  inactiveStatus: {
    backgroundColor: '#f3f4f6',
    color: '#6b7280',
  },
  securityButton: {
    justifyContent: 'flex-start',
    paddingHorizontal: 0,
  },
  deleteButton: {
    justifyContent: 'flex-start',
    paddingHorizontal: 0,
  },
  deleteButtonLabel: {
    color: '#ef4444',
  },
  logoutButton: {
    marginBottom: 24,
    borderColor: '#cbd5e1',
  },
});
